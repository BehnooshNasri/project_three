DROP TABLE IF EXISTS civil_case_data;

CREATE TABLE "civil_case_data" (
    "Year_Period" varchar(100)   NOT NULL,
    "Jurisdiction" varchar(100)   NOT NULL,
    "Case_Type" varchar(100),
    "Case_Count" int   
);

SELECT * FROM civil_case_data;