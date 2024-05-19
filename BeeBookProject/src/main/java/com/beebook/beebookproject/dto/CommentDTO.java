package com.beebook.beebookproject.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
public class CommentDTO {
    private String user_name;
    private String comment;
    private String created_at;

    public CommentDTO(String userName,String comment, String createdAt) {
        this.user_name = userName;
        this.comment = comment;
        this.created_at = createdAt;
    }
}
