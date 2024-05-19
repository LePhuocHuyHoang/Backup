package com.beebook.beebookproject.dto;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor @AllArgsConstructor
@Data
public class UserDto {
    private String userName;
    private String firstName;
    private String lastName;
    private Date dob;
    private Long point;
    private String gender;
    private String email;
}
