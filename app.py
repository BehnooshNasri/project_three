from flask import Flask, jsonify, render_template, request
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.ext.automap import automap_base


app = Flask(__name__)

# Create engine and reflect database tables
engine = create_engine("postgresql+psycopg2://postgres:postgres@localhost:5432/project_three", echo=False)  
Base = automap_base()
Base.prepare(engine)
print(Base.classes.keys())
# Map the classes to the tables
Civil = Base.classes.civil_case_data  

@app.route("/api/v1.0/civil_court_data")
def civil_court_data():
    session = Session(engine)

    year = request.args.get('year')

    if year: 
        results = session.query(Civil).filter_by(Year_Period=year).all()
    else: 
        results = session.query(Civil).all()
    # session.close()
    
    # Convert results to dictionary for JSON serialization
    civil_data = []
    for result in results:
        civil_data.append({
            "ID": result.ID,  
            "Year_Period": result.Year_Period,
            "Jurisdiction": result.Jurisdiction,
            "Case_Type": result.Case_Type,
            "Case_Count": result.Case_Count
        })
    
    return jsonify(civil_data)

@app.route('/') 
def main(): 
    return render_template("index.html")

@app.route('/jurisdiction_chart')
def jurisdiction_chart():
    return render_template("jurisdiction_chart.html")

@app.route('/case_type_chart')
def case_type_chart():
    return render_template("case_type_chart.html")

@app.route('/full_chart')
def full_chart():
    return render_template("full_chart.html")

if __name__ == "__main__":
    app.run(debug=True)

