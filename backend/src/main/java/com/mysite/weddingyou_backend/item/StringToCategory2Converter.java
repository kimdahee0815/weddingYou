package com.mysite.weddingyou_backend.item;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class StringToCategory2Converter implements Converter<String, Item.Category2> {

    private static final Map<String, Item.Category2> MAP = new HashMap<>();

    static {
        for (Item.Category2 c : Item.Category2.values()) {
            MAP.put(c.name(), c);
        }
        // Frontend display names that differ from enum constant names
        MAP.put("A-line",             Item.Category2.Aline);
        MAP.put("H-line",             Item.Category2.Hline);
        MAP.put("Ball Gown",          Item.Category2.BallGown);
        MAP.put("Men's Suit",         Item.Category2.MensSuit);
        MAP.put("Subject-focused",    Item.Category2.SubjectFocused);
        MAP.put("Background-focused", Item.Category2.BackgroundFocused);
        MAP.put("Hand-tied",          Item.Category2.HandTied);
    }

    @Override
    public Item.Category2 convert(String source) {
        return fromString(source);
    }

    public static Item.Category2 fromString(String source) {
        Item.Category2 result = MAP.get(source);
        if (result == null) {
            throw new IllegalArgumentException("Unknown Category2: " + source);
        }
        return result;
    }
}
