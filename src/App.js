import React, { Component } from 'react';
import './App.css';
import companyRecords from './companies.js'
import scores from './score-records.js'
import csv from 'csvtojson'




class App extends Component {
  constructor() {
    super()
    this.state = {
      currentId: '',
      communcation: 0,
      coding: 0,
      employee: {}
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.percentileCommunication = this.percentileCommunication.bind(this)
    this.percentileCoding = this.percentileCoding.bind(this)
  }

  render() {
    console.log(this.state)
    return (
      <div>
        <form id ="handleSubmit" onSubmit={this.handleSubmit}>
            <div>
                <input type="text" name="id" placeholder="Enter your employee id here..." 
                 required onChange={(e) => this.setState({currentId: e.target.value})}/>
            </div>
            <div id="buttonForm">
                <button type="submit" id="percentile">Get Percentiles</button>
            </div>
            </form>
            {this.state.employee.doesNotExist && <p>No employee record found</p>}
            {this.state.employee.communication_score && 
            <div>
              <p>Title: {this.state.employee.title}</p>
              <p>Company id: {this.state.employee.company_id}</p>
              <p>Communication score: {this.state.employee.communication_score}</p>
              <p>Coding score: {this.state.employee.coding_score}</p>
              {this.state.communcation > 0 && <p>Communication percentile: {this.state.communcation}</p>}
              {this.state.coding > 0 && <p>Coding percentile: {this.state.coding}</p>}
            </div>
            }
            
      </div>
    );
  }

  
  

  percentileCommunication(employee, employeeArray) {
    const newEmployeeArray = employeeArray.slice()
    // Sort the array in ascending order by the communcation_score
    newEmployeeArray.sort((a, b) => {
      return a.communication_score - b.communication_score
    })

    // Find the percentile of the given employee
    const employeeIndex = newEmployeeArray.findIndex(currentEmployee => {
      return (currentEmployee.candidate_id === employee.candidate_id)
    })

    this.setState({communcation: (((employeeIndex + 1) * 100) / employeeArray.length - 1)}) 
  }

  percentileCoding(employee, employeeArray) {
    const newEmployeeArray = employeeArray.slice()
    // Sort the array in ascending order by the coding_score
    newEmployeeArray.sort((a, b) => {
      return a.coding_score - b.coding_score
    })
    
    // Find the percentile of the given employee
    const employeeIndex = newEmployeeArray.findIndex(currentEmployee => {
      return (currentEmployee.candidate_id === employee.candidate_id && currentEmployee.communication_score === employee.communication_score)
    })

    this.setState({coding: (((employeeIndex + 1) * 100) / employeeArray.length - 1)}) 
  }

  handleSubmit(e) {
    e.preventDefault()
    let employeeInfo 
    let companyFractal
    let companyArray = []
    let employeeArray= []
    // csv is used to parse through the .csv files
    csv()
      .fromString(scores)
      .on('json',(jsonObj)=>{ 
          // Finds the employee with the provided id and sets it to 'employeeInfo'
          if (jsonObj.candidate_id === this.state.currentId) {
            employeeInfo = jsonObj
          }
      })
      .on('done',()=>{
          // If the employee record does not exist, display that for the user
          if (!employeeInfo) {
            this.setState({employee: {doesNotExist: true}})
          }
          // If the employee record exists...
          else{
            csv()
              .fromString(companyRecords)
              .on('json',(jsonObj)=>{ 
                // Find the fractal rating for the company the employee belongs to
                  if (jsonObj.company_id === employeeInfo.company_id) {
                    companyFractal = jsonObj.fractal_index
                  }
              })
              .on('done',()=>{
                  csv()
                    .fromString(companyRecords)
                    .on('json',(jsonObj)=>{ 
                      // Finds the companies that are similar enough to the employee's company
                        if (areSimilar(companyFractal, jsonObj.fractal_index)) {
                          companyArray.push(jsonObj.company_id)
                        }
                    })
                    .on('done',()=>{
                        csv()
                        .fromString(scores)
                        .on('json',(jsonObj)=>{ 
                          // Find all employees with the same job title AND who work at similar companies
                          // 'employeeArray' will contain all employees that we want to use for the percentile calculation
                          if (companyArray.indexOf(jsonObj.company_id) > -1 && jsonObj.title === employeeInfo.title) {
                            employeeArray.push(jsonObj)
                          }
                        })
                        .on('done',()=>{
                            this.percentileCommunication(employeeInfo, employeeArray)
                            this.percentileCoding(employeeInfo, employeeArray)
                            this.setState({employee: employeeInfo})
                        })
                    })
              })
            }
        })    
  }
}

export function areSimilar(fractal1, fractal2) {
  return Math.abs(fractal1 - fractal2) < 0.15
}

export default App;
