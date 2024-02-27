from flask import Flask, jsonify, render_template
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import Session
from sqlalchemy.ext.declarative import declarative_base

app = Flask(__name__)

# Create engine
engine = create_engine("postgresql://postgres:postgres@localhost:5432/project_three", echo=False)

# Define Base
Base = declarative_base()

# Define the mapped class
class Civil(Base):
    __tablename__ = 'civil_case_data'

    Year_Period = Column(String)
    Jurisdiction = Column(String)
    Case_Type = Column(String)
    Case_Count = Column(Integer)

@app.route('/') 
def main(): 
    return render_template("index.html")

@app.route("/api/v1.0/civil_court_data")
def civil_court_data():
    session = Session(engine)
    results = session.query(Civil).all()
    
    # Convert results to dictionary for JSON serialization
    civil_data = []
    for result in results:
        civil_data.append({
            "Year_Period": result.Year_Period,
            "Jurisdiction": result.Jurisdiction,
            "Case_Type": result.Case_Type,
            "Case_Count": result.Case_Count
        })
    
    session.close()
    
    return jsonify(civil_data)

if __name__ == "__main__":
    app.run(debug=True)




# from flask import Flask, jsonify, render_template
# from sqlalchemy import create_engine
# from sqlalchemy.orm import Session
# from sqlalchemy.ext.automap import automap_base

# app = Flask(__name__)

# # Create engine and reflect database tables
# engine = create_engine("postgresql://postgres:postgres@localhost:5432/project_three", echo=False)  
# Base = automap_base()
# Base.prepare(engine, reflect=True)

# # Map the classes to the tables
# Civil = Base.classes.civil_case_data  

# @app.route('/') 
# def main(): 
#     return render_template("index.html")

# @app.route("/api/v1.0/civil_court_data")
# def civil_court_data():
#     session = Session(engine)
#     results = session.query(Civil).all()
#     session.close()
    
#     # Convert results to dictionary for JSON serialization
#     civil_data = []
#     for result in results:
#         civil_data.append({
#             "Year_Period": result.Year_Period,
#             "Jurisdiction": result.Jurisdiction,
#             "Case_Type": result.Case_Type,
#             "Case_Count": result.Case_Count
#         })
    
#     session.close()

#     return jsonify(civil_data)

# if __name__ == "__main__":
#     app.run(debug=True)
