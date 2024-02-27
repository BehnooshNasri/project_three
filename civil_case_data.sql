DROP TABLE IF EXISTS civil_case_data;

CREATE TABLE "civil_case_data" (
    "ID" int   NOT NULL,
    "Year_Period" varchar(100)   NOT NULL,
    "Jurisdiction" varchar(100)   NOT NULL,
    "Case_Type" varchar(100),
    "Case_Count" int,
    CONSTRAINT "pk_civil_case_data" PRIMARY KEY (
        "ID"
     )
);

SELECT * FROM civil_case_data;