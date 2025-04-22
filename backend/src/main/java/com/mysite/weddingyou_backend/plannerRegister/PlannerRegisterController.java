package com.mysite.weddingyou_backend.plannerRegister;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PlannerRegisterController {
    private final PlannerRegisterService plannerService;

    @Autowired
    public PlannerRegisterController(PlannerRegisterService plannerService) {
        this.plannerService = plannerService;
    }

    @PostMapping("/planner/register")
    public ResponseEntity<PlannerRegister> createPlanner(@Valid @RequestBody PlannerRegisterDTO plannerDTO) {
        PlannerRegister createdPlanner = null;
		try {
			createdPlanner = plannerService.createPlanner(plannerDTO);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		 return ResponseEntity.status(HttpStatus.CREATED).body(createdPlanner);
    }
}
