# Project Three: Canadian and Certain Jurisdictions Civil Court Cases by Level of Court and Type of Case from 2005 to 2022

## Introduction

This project aims to visualize the civil court cases that have been initiated in Canada and certain jurisdictions using the data gathered by the govenrment of Canada between the years 2005 to 2022. The purpose of the project is to compare the provincial and federal civil court cases through the years and compare jurisdictions. 

Civil court case is initiated when individuals or corporations disagree on a legal matter. A civil case may also arise if someone is injured or there is damage to property. Family law also includes a substanital amount of civil cases which may include divorce, seperation child custody, access and support, and other family issues. 

The questions this projects is attempting to explore and visualize are: 

1. Is there a certain jurisdiction that has more civil court cases? 1. Ontario 2. Alberta 3. BC
2. What type of civil court cases (family or general civil) are more frequent in all jurisdictions? In all the jurisdictions except for Nunavut, there are more general civil cases.
3. Has there been a significant growth pattern acorss different jurisdictions in the number of cases? The opposite is in fact correct. There was a growth trajectrory in almost all the jurisdcitions however in the last couple of years the numbers have gone down significantly. 

## Methodology

### ETL 

The data was published by Statistic Canada in CSV format. I used Jupyter Notebook to clean up the data and imported into a postgres SQL server using pgAdmin. 

### Flask

I used SQLAlchemy to create the an API that holds the data from the SQL server. Then in order to query parameters I used the following code to filter the results: 

``` @app.route("/api/v1.0/civil_court_data")
def civil_court_data():
    session = Session(engine)

    # Get query parameters
    year = request.args.get('year')
    place = request.args.get('place')

    # Filter data based on query parameters
    query = session.query(Civil)
    if year:
        query = query.filter_by(Year_Period=year)
    if place:
        query = query.filter_by(Jurisdiction=place)
    
    results = query.all()
    ```


### HTML 

I created three HTML files: an index HTML file for the main route, and two HTML files, one for each remaining route. 

#### index.html 

I used Bootstrap for styling and creating the navigation bar on the index page:

```  <header class="bg-dark text-light py-4">
        <div class="container">
            <h1>Welcome to Civil Case Data Main Page!</h1>
        </div>
    </header>

    <nav class="bg-light py-3 d-flex justify-content-center">
        <ul class="nav">
            <li class="nav-item"><a class="nav-link" href="/api/v1.0/civil_court_data">Civil Court Data API</a></li>
            <li class="nav-item"><a class="nav-link" href="/jurisdiction_chart">Jurisdiction Data</a></li>
            <li class="nav-item"><a class="nav-link" href="/full_chart">Full Data</a></li>
        </ul>
    </nav>
    ``` 

### JavaScript



## Data and Resources

The data was retrieved from government of Canada's open database. 

### Dataset

- Civil court cases, by level of court and type of case, Canada and selected provinces and territories - Dataset (https://open.canada.ca/data/en/dataset/5641ad22-190a-4486-8c5d-3884328a51a5/resource/108a7554-fe40-4fba-951a-d06debb76bca)


## Analysis

TBD

## Limitations

TBD

## Project Member

This is a solo project by: 

- Behnoosh Nasri 