package com.beebook.beebookproject.sec;



public class StripeConfig {

    private static String stripeApiKey = "sk_test_51P9I2UI5ZFMMDZOHaNi3R8I0i30RQPuRuwYZkboYDE8cJlpGqBIByd1BDDjZ5YLHFp4FY9QicvLdJHsl3FRNVz0R00F1Gvv3TB";
    private static String stripePublishableKey = "pk_test_51P9I2UI5ZFMMDZOHlKQItbzbnk36ZfhWzUFqe1rKWRCcCtX0eCqqEUwuYo0r0OZTDc1fBqywI5XV0n5XLTaINTX500AR5Z8pyc";

    public static String getStripeApiKey() {
        return stripeApiKey;
    }

    public static String getStripePublishableKey() {
        return stripePublishableKey;
    }
}
