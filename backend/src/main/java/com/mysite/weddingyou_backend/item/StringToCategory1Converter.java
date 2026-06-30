package com.mysite.weddingyou_backend.item;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class StringToCategory1Converter implements Converter<String, Item.Category1> {

    private static final Map<String, Item.Category1> MAP = new HashMap<>();

    static {
        for (Item.Category1 c : Item.Category1.values()) {
            MAP.put(c.name(), c);
        }
        // camelCase canonical names (used throughout frontend)
        MAP.put("weddingHall",   Item.Category1.WeddingHall);
        MAP.put("weddingOutfit", Item.Category1.Outfit);
        MAP.put("studio",        Item.Category1.Studio);
        MAP.put("makeup",        Item.Category1.Makeup);
        MAP.put("honeymoon",     Item.Category1.Honeymoon);
        MAP.put("bouquet",       Item.Category1.Bouquet);
    }

    @Override
    public Item.Category1 convert(String source) {
        Item.Category1 result = MAP.get(source);
        if (result == null) {
            throw new IllegalArgumentException("Unknown Category1: " + source);
        }
        return result;
    }
}
