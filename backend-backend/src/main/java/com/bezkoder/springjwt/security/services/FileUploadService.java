package com.bezkoder.springjwt.security.services;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.SdkClientException;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.PutObjectRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class FileUploadService {

    @Value("test")
    private String bucketName;

    @Value("test")
    private String accessKey;

    @Value("test")
    private String secretKey;

    @Value("test")
    private String region;

    public String uploadFile(MultipartFile file, String keyName) {
        try {
            BasicAWSCredentials awsCredentials = new BasicAWSCredentials(accessKey, secretKey);
            AmazonS3 s3Client = AmazonS3ClientBuilder.standard()
                    .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
                    .withRegion(region)
                    .build();

            s3Client.putObject(new PutObjectRequest(bucketName, keyName, file.getInputStream(), null));

            return s3Client.getUrl(bucketName, keyName).toString();
        } catch (AmazonServiceException e) {
            e.printStackTrace();
            throw new RuntimeException("Error uploading file to S3: " + e.getMessage());
        } catch (SdkClientException | IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Error uploading file to S3: " + e.getMessage());
        }
    }
}
