package com.mysite.weddingyou_backend.item;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import javax.validation.constraints.NotNull;

import com.mysite.weddingyou_backend.item.Item.Category1;
import com.mysite.weddingyou_backend.item.Item.Category2;
import com.mysite.weddingyou_backend.like.likeDTO;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemDTO {

	@NotNull
	private Long itemId;
	
	@NotNull
    private String itemImg;
	
	@NotNull
    private String itemName;

    private LocalDateTime itemWriteDate;
	
	@NotNull
	private String content;

    @NotNull
	private String imgContent;
	
	@NotNull
    private Category1 category1;
	
	@NotNull
    private Category2 category2;

    private List<likeDTO> like;
	
	public static ItemDTO fromEntity(Item item) {
		ItemDTO itemDTO = new ItemDTO();
        itemDTO.setItemId(item.getItemId());
        itemDTO.setItemName(item.getItemName());
        itemDTO.setItemImg(item.getItemImg());
        itemDTO.setContent(item.getContent());
        itemDTO.setImgContent(item.getImgContent());
        itemDTO.setItemWriteDate(item.getItemWriteDate());
        itemDTO.setCategory1(item.getCategory1());
        itemDTO.setCategory2(item.getCategory2());
        itemDTO.setLike(item.getLike().stream()
            .map(likeDTO::fromEntity)
            .collect(Collectors.toList()));
        return itemDTO;
	}

    
}
