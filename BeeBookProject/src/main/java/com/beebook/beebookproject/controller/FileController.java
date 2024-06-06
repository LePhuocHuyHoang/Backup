package com.beebook.beebookproject.controller;


import com.beebook.beebookproject.base.BaseResponse;
import com.beebook.beebookproject.hdfs.HadoopClient;
import com.beebook.beebookproject.common.util.FileUtil;
import lombok.AllArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.*;

/**
 * hadoop hdfs文件操作相关接口
 *
 * @author zhangcx
 * on 2020/5/30 - 14:15
 */
@RestController
@RequestMapping("file")
@AllArgsConstructor
public class FileController {

    private HadoopClient hadoopClient;

    @PostMapping("uploads")
    public BaseResponse uploads(@RequestParam String uploadPath, @RequestParam("files") MultipartFile[] files) {
        List<String> filePaths = new ArrayList<>();
        for (MultipartFile file : files) {
            filePaths.add(FileUtil.MultipartFileToFile(file).getPath());
        }
        hadoopClient.copyFilesToHDFS(false, true, filePaths, uploadPath);
        return BaseResponse.ok();
    }

    /**
     * Tạo một thư mục (Tạo thư mục sách)
     */
    @PostMapping("mkdir")
    public BaseResponse mkdir(@RequestParam String folderPath) {
        boolean result = true;
        if (StringUtils.isNotEmpty(folderPath)) {
            result = hadoopClient.mkdirfolder(folderPath, true);
        }
        return BaseResponse.ok(result);
    }
    /**
     * Xóa tập tin hoặc thư mục
     */
    @PostMapping("rmdir")
    public BaseResponse rmdir(@RequestParam String path, @RequestParam(required = false) String fileName) {
        hadoopClient.rmdir(path, fileName);
        return BaseResponse.ok();
    }
    @GetMapping("/readFileToImagePages")
    public BaseResponse<?> readFileToImagePages(@RequestParam int page, @RequestParam int bookId) {

        if(!hadoopClient.isPathExists("/data/book/book_" + bookId)) {
            return BaseResponse.ok(HttpStatus.BAD_REQUEST, "Book id is not exists");
        }
        if(page < 1){
            return BaseResponse.ok(HttpStatus.BAD_REQUEST, "Page number must be greater than or equal to 1");
        }
        int pageSize = 15; // Số lượng giá trị mỗi trang
        int startId = (page - 1) * pageSize + 1; // ID bắt đầu của trang hiện tại
        int endId = startId + pageSize - 1; // ID kết thúc của trang hiện tại
        List<Map<String, String>> imgs = new ArrayList<>();
        try {
            for (int i = startId; i <= endId; i++) {
                Map<String, String> bookCoverMap = new HashMap<>();
                String filePath = "/data/book/book_" + bookId +"/img_" + i + ".jpg";
                byte[] imageData = hadoopClient.readFiletoByte(filePath);

                if (imageData != null && imageData.length > 0) {
                    String base64Image = Base64.getEncoder().encodeToString(imageData);
                    bookCoverMap.put("img_"+i, base64Image);
                } else {
                    if(i == startId){
                        return BaseResponse.ok(Collections.emptyList());
                    }
                    // Nếu không có cover cho sách, gán giá trị rỗng
                    bookCoverMap.put("img_"+i, "");
                }
                if (!bookCoverMap.isEmpty()) {
                    imgs.add(bookCoverMap);
                }
            }
            return BaseResponse.ok(imgs);
        } catch (Exception e) {
            e.printStackTrace();
            return BaseResponse.error("Error occurred while reading files to images.");
        }
    }

    @GetMapping("/getBookCoverList")
    public BaseResponse<List<Map<String, String>>> getBookCoverList(@RequestParam String bookIdList) {
        String path = "/data/book";
        String[] bookIds = bookIdList.split(",");
        List<Map<String, String>> bookCovers = new ArrayList<>();

        try {
            for (String bookId : bookIds) {
                String bookCoverFilePath = path + "/book_" + bookId + "/book_cover.jpg";
                String backgroundCoverFilePath = path + "/book_" + bookId + "/background_cover.jpg";

                byte[] imageBookCoverData = hadoopClient.readFiletoByte(bookCoverFilePath);
                byte[] imageBackgroundCoverData = hadoopClient.readFiletoByte(backgroundCoverFilePath);

                // Tạo một map mới để chứa dữ liệu cover của sách
                Map<String, String> bookCoverMap = new HashMap<>();


                if (imageBookCoverData != null && imageBookCoverData.length > 0) {
                    String base64ImageBookCover = Base64.getEncoder().encodeToString(imageBookCoverData);
                    bookCoverMap.put("book_cover", base64ImageBookCover);
                } else {
                    // Nếu không có cover cho sách, gán giá trị rỗng
                    bookCoverMap.put("book_cover", "");
                }

                if (imageBackgroundCoverData != null && imageBackgroundCoverData.length > 0) {
                    String base64ImageBackgroundCover = Base64.getEncoder().encodeToString(imageBackgroundCoverData);
                    bookCoverMap.put("background_cover", base64ImageBackgroundCover);
                } else {
                    // Nếu không có background cover, gán giá trị rỗng
                    bookCoverMap.put("background_cover", "");
                }
                // Kiểm tra xem map có chứa dữ liệu không trước khi thêm vào list
                if (!bookCoverMap.isEmpty()) {
                    bookCovers.add(bookCoverMap);
                }
            }
            return BaseResponse.ok(bookCovers);
        } catch (Exception e) {
            // Xử lý lỗi nếu có
            e.printStackTrace();
            return BaseResponse.error("Error occurred while fetching book covers.");
        }
    }
    /**
     * Đọc List image
     * @param directoryPath
     * @return
     */
    @GetMapping("/readFilesToImages")
    public BaseResponse readFilesToImages(@RequestParam String directoryPath) {
        List<Map<String, Object>> imageList = hadoopClient.readFilesToImages(directoryPath);
        if (imageList != null && !imageList.isEmpty()) {
            return BaseResponse.ok(imageList);
        } else {
            return BaseResponse.error("Không thể đọc tệp.");
        }
    }

}
