package food_api.foods.util;

import org.apache.commons.codec.digest.HmacAlgorithms;
import org.apache.commons.codec.digest.HmacUtils;

public class PayOSChecksumUtil {
    public static String hmacSha256(String data, String key) {
        // Sử dụng HmacUtils từ thư viện commons-codec (bạn đã có trong pom.xml)
        return new HmacUtils(HmacAlgorithms.HMAC_SHA_256, key).hmacHex(data);
    }
}