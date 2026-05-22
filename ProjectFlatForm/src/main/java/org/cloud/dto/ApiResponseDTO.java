package org.cloud.dto;

import java.util.List;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class ApiResponseDTO {

	private Response response;

    @Getter @Setter
    public static class Response {
        private Body body;
    }

    @Getter @Setter
    public static class Body {
        private Items items;
    }

    @Getter @Setter
    public static class Items {
        private List<PriceDTO> item;
    }
}
