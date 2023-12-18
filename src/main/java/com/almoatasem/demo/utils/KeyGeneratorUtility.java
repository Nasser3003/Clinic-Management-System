package com.almoatasem.demo.utils;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;

public class KeyGeneratorUtility {
     public static KeyPair generateRSAKey() {

         KeyPair keyPair;

         try {
             KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
             keyPairGenerator.initialize(2048);
             keyPair = keyPairGenerator.generateKeyPair();
         } catch (NoSuchAlgorithmException e) {
             throw new RuntimeException("Error generating RSA key pair. Algorithm not found.", e);
         }
         catch (Exception e) {
             throw new RuntimeException("Error generating RSA key pair.", e);
         }
         return keyPair;
     }
}
