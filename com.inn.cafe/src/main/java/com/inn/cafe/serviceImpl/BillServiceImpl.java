package com.inn.cafe.serviceImpl;

import com.google.common.base.Strings;
import com.google.gson.JsonArray;
import com.inn.cafe.JWT.CustomerUserDetailsService;
import com.inn.cafe.JWT.JwtFilter;
import com.inn.cafe.POJO.Bill;
import com.inn.cafe.POJO.Category;
import com.inn.cafe.config.BillStorageService;
import com.inn.cafe.constents.CafeConstants;
import com.inn.cafe.dao.BillDao;
import com.inn.cafe.service.BillService;
import com.inn.cafe.utils.CafeUtils;
import com.inn.cafe.utils.EmailUtil;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.io.IOUtils;
import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.stereotype.Service;
import org.springframework.core.io.ClassPathResource;

import java.io.*;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Stream;

@Slf4j
@Service
public class BillServiceImpl implements BillService {
    @Autowired
    BillDao billDao;

    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    com.inn.cafe.JWT.jwtUtil jwtUtil;

    @Autowired
    JwtFilter jwtFilter;
    @Autowired
    CustomerUserDetailsService customerUserDetailsService;

    @Autowired
    EmailUtil emailUtil;

    @Autowired
    BillStorageService billStorageService;

    private static final BaseColor COFFEE_PRIMARY = new BaseColor(156, 102, 68);
    private static final BaseColor COFFEE_LIGHT = new BaseColor(237, 224, 212);

    @Override
    public ResponseEntity<String> generateReport(Map<String, Object> requestMap) {
        log.info("Insert generateReport");
        try {
            String filename;
            if (validateResquestMap(requestMap)) {
                if (requestMap.containsKey("isGenerate") && !(Boolean) requestMap.get("isGenerate")) {
                    filename = (String) requestMap.get("uuid");
                } else {
                    filename = CafeUtils.getUUID();
                    requestMap.put("uuid", filename);
                    insertBill(requestMap);
                }
                Path pdfPath = billStorageService.resolvePdfPath(filename);
                String dateTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a"));
                String customerInfo = "Customer: " + requestMap.get("name") + "\n"
                        + "Phone: " + requestMap.get("contactNumber") + "\n"
                        + "Email: " + requestMap.get("email") + "\n"
                        + "Payment: " + requestMap.get("paymentMethod") + "\n"
                        + "Date: " + dateTime;

                Document document = new Document();
                PdfWriter.getInstance(document, new FileOutputStream(pdfPath.toFile()));
                document.open();
                setRectaangleInPdf(document);

                // Add Logo
                try {
                    ClassPathResource logoResource = new ClassPathResource("logo.png");
                    if (logoResource.exists()) {
                        Image logo = Image.getInstance(logoResource.getURL());
                        logo.scaleToFit(80, 80);
                        logo.setAlignment(Element.ALIGN_CENTER);
                        document.add(logo);
                    }
                } catch (Exception e) {
                    log.warn("Could not load logo for PDF", e);
                }

                Paragraph title = new Paragraph("☕ Brew Haven Cafe", getFont("Header"));
                title.setAlignment(Element.ALIGN_CENTER);
                title.setSpacingAfter(10);
                document.add(title);

                Paragraph address = new Paragraph("123 Coffee Street, Brew City\nInvoice #" + filename, getFont("Data"));
                address.setAlignment(Element.ALIGN_CENTER);
                address.setSpacingAfter(20);
                document.add(address);

                Paragraph paragraph = new Paragraph("\n" + customerInfo + "\n\n", getFont("Data"));
                document.add(paragraph);

                // Create table in pdf to print data
                PdfPTable table = new PdfPTable(5);
                table.setWidthPercentage(100);
                addTableHeader(table);


                // Print table data
                JSONArray jsonArray = CafeUtils.getJsonArrayFromString((String) requestMap.get("productDetails"));
                for (int i = 0; i < jsonArray.length(); i++) {
                    addRows(table, CafeUtils.getMapFromJson(jsonArray.getString(i)));
                }

                document.add(table);

                Paragraph footer = new Paragraph("\nTotal: Rs " + requestMap.get("totalAmount") + "\n\n"
                        + "☕ Thank you for visiting Brew Haven Cafe!", getFont("Data"));
                footer.setAlignment(Element.ALIGN_CENTER);
                document.add(footer);
                document.close();
                return new ResponseEntity<>("{\"uuid\":\"" + filename + "\"}", HttpStatus.OK);
            }
            return CafeUtils.getResponeEntity("Required data not found", HttpStatus.BAD_REQUEST);
        } catch (Exception ex) {
            log.error("Bill generation failed", ex);
            return CafeUtils.getResponeEntity("Could not generate bill PDF: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<List<Bill>> getBills() {
        List<Bill> list = new ArrayList<>();
        if (jwtFilter.isAdmin()) {
            list = billDao.getAllBills();
        } else {
            list = billDao.getBillByUserName(jwtFilter.getCurrentUsername());
        }
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<byte[]> getPdf(Map<String, Object> requestMap) {
        log.info("Inside getPdf : requestMap {}", requestMap);
        try {
            byte[] byteArray = new byte[0];
            if (!requestMap.containsKey("uuid") && validateResquestMap(requestMap)) {
                return new ResponseEntity<>(byteArray, HttpStatus.BAD_REQUEST);
            }
            String uuid = (String) requestMap.get("uuid");
            Path pdfPath = billStorageService.resolvePdfPath(uuid);
            String filepath = pdfPath.toString();

            if (CafeUtils.isFileExist(filepath)) {
                byteArray = getByteArray(filepath);
                return new ResponseEntity<>(byteArray, HttpStatus.OK);
            }
            requestMap.put("isGenerate", false);
            ResponseEntity<String> generated = generateReport(requestMap);
            if (generated.getStatusCode().is2xxSuccessful() && CafeUtils.isFileExist(filepath)) {
                byteArray = getByteArray(filepath);
                return new ResponseEntity<>(byteArray, HttpStatus.OK);
            }
            return new ResponseEntity<>(byteArray, HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            log.error("PDF download failed", ex);
            return new ResponseEntity<>(new byte[0], HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<String> delete(Integer id) {
        try {
            if (jwtFilter.isAdmin()) {
                Optional optional = billDao.findById(id);
                if (!optional.isEmpty()) {
                    billDao.deleteById(id);
                    //System.out.println("Product is deleted successfully");
                    return CafeUtils.getResponeEntity("Bill is deleted successfully", HttpStatus.OK);
                }
                //System.out.println("Product id doesn't exist");
                return CafeUtils.getResponeEntity("Bill id doesn't exist", HttpStatus.OK);
            } else {
                return CafeUtils.getResponeEntity(CafeConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return CafeUtils.getResponeEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private void insertBill(Map<String, Object> requestMap) {
        try {
            Bill bill = new Bill();
            bill.setUuid((String) requestMap.get("uuid"));
            bill.setName((String) requestMap.get("name"));
            bill.setEmail((String) requestMap.get("email"));
            bill.setContactNumber((String) requestMap.get("contactNumber"));
            bill.setPaymentMethod((String) requestMap.get("paymentMethod"));
            bill.setTotal((int) Double.parseDouble((String) requestMap.get("totalAmount")));

            bill.setProductDetails((String) requestMap.get("productDetails"));
            bill.setCreatedBy(jwtFilter.getCurrentUsername());
            billDao.save(bill);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    private boolean validateResquestMap(Map<String, Object> requestMap) {
        return requestMap.containsKey("name") &&
                requestMap.containsKey("contactNumber") &&
                requestMap.containsKey("email") &&
                requestMap.containsKey("paymentMethod") &&
                requestMap.containsKey("productDetails") &&
                requestMap.containsKey("totalAmount");
    }

    private void setRectaangleInPdf(Document document) throws DocumentException {
        log.info("Inside setRectaangleInPdf.");
        Rectangle rectangle = new Rectangle(577, 825, 18, 15);
        rectangle.enableBorderSide(1);
        rectangle.enableBorderSide(2);
        rectangle.enableBorderSide(4);
        rectangle.enableBorderSide(8);
        rectangle.setBorderColor(BaseColor.BLACK);
        rectangle.setBorderWidth(1);
        document.add(rectangle);
    }

    private Font getFont(String type) {
        log.info("Inside getFont");
        switch (type) {
            case "Header":
                Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLDOBLIQUE, 18, BaseColor.BLACK);
                headerFont.setStyle(Font.BOLD);
                return headerFont;
            case "Data":
                Font dareFont = FontFactory.getFont(FontFactory.TIMES_ROMAN, 11, BaseColor.BLACK);
                dareFont.setStyle(Font.BOLD);
                return dareFont;
            default:
                return new Font();
        }
    }

    private void addTableHeader(PdfPTable table) {
        log.info("Inside addTableHeader");
        Stream.of("Name", "Category", "Quantity", "Price", "Sub Total")
                .forEach(columnTitle -> {
                    PdfPCell header = new PdfPCell();
                    header.setBackgroundColor(BaseColor.LIGHT_GRAY);
                    header.setBorderWidth(2);
                    header.setPhrase(new Phrase(columnTitle));
                    header.setBackgroundColor(COFFEE_LIGHT);
                    header.setHorizontalAlignment(Element.ALIGN_CENTER);
                    header.setVerticalAlignment(Element.ALIGN_CENTER);
                    table.addCell(header);
                });
    }

    private void addRows(PdfPTable table, Map<String, Object> data) {
        log.info("Inside addRows");
        table.addCell(String.valueOf(data.get("name")));
        table.addCell(String.valueOf(data.get("category")));
        table.addCell(String.valueOf(data.get("quantity")));
        table.addCell(String.valueOf(toDouble(data.get("price"))));
        table.addCell(String.valueOf(toDouble(data.get("total"))));
    }

    private double toDouble(Object value) {
        if (value instanceof Number number) {
            return number.doubleValue();
        }
        return Double.parseDouble(String.valueOf(value));
    }

    private byte[] getByteArray(String filepath) throws Exception {
        File initalFile = new File(filepath);
        InputStream targetStream = new FileInputStream(initalFile);
        byte[] byteArray = IOUtils.toByteArray(targetStream);
        targetStream.close();
        return byteArray;
    }

}
