import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, configure, mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-15';
configure({ adapter: new Adapter() });
import App, {areSimilar} from './App';
import sinon from 'sinon'
import chai from 'chai';
const expect = chai.expect;


describe('Functions to calculate percentiles', () => {
  let wrapper = shallow(<App/>);
  it('has a percentileCommunication function', () => {   
    expect(wrapper.instance().percentileCommunication).to.be.a('Function');    
  }) 

  it('sets the state with the correct percentile', () => {
    wrapper.instance().percentileCommunication({candidate_id: 1, communication_score: 1}, [{candidate_id: 1, communication_score: 1}, {candidate_id: 2, communication_score: 2}, {candidate_id: 3, communication_score: 3}, {candidate_id: 4, communication_score: 4}])
    expect(wrapper.state()).to.be.deep.equal({currentId: "", communcation: 24, coding: 0, employee:{}})
    wrapper.instance().percentileCommunication({candidate_id: 2, communication_score: 2}, [{candidate_id: 1, communication_score: 1}, {candidate_id: 2, communication_score: 2}, {candidate_id: 3, communication_score: 3}, {candidate_id: 4, communication_score: 4}])
    expect(wrapper.state()).to.be.deep.equal({currentId: "", communcation: 49, coding: 0, employee:{}})
  })

  it('has a percentileCoding function', () => {   
    expect(wrapper.instance().percentileCoding).to.be.a('Function');    
  }) 

  it('sets the state with the correct percentile', () => {
    wrapper.instance().percentileCoding({candidate_id: 1, coding_score: 1}, [{candidate_id: 1, coding_score: 1}, {candidate_id: 2, coding_score: 2}, {candidate_id: 3, coding_score: 3}, {candidate_id: 4, coding_score: 4}])
    expect(wrapper.state()).to.be.deep.equal({currentId: "", communcation: 49, coding: 24, employee:{}})
    wrapper.instance().percentileCoding({candidate_id: 2, coding_score: 2}, [{candidate_id: 1, coding_score: 1}, {candidate_id: 2, coding_score: 2}, {candidate_id: 3, coding_score: 3}, {candidate_id: 4, coding_score: 4}])
    expect(wrapper.state()).to.be.deep.equal({currentId: "", communcation: 49, coding: 49, employee:{}})
  })
})

describe('areSimilar function', () => {
  it('has an areSimilar function', () => {
    expect(areSimilar).to.be.a('Function')
  })
  
  it('returns true when the 2 provided fractals are within 0.15 of each other', () => {
    expect(areSimilar(0.678, 0.782)).equal(true)
  })
  it('returns true when the 2 provided fractals are within 0.15 of each other, even when the resulting subtraction is negative', () => {
    expect(areSimilar(0.782, 0.678)).equal(true)
  })
  it('returns false when the 2 provided fractals are further than 0.15 of each other', () => {
    expect(areSimilar(0.523, 0.678)).equal(false)
  })
})

describe('handleSubmit function', () => {
  let wrapper = shallow(<App/>);
  it('has a handleSubmit function', () => {
    expect(wrapper.instance().handleSubmit).to.be.a('Function')
  })
//   it('will set the state with an error-indicating message if the employee record does not exist ', () => {
//     wrapper.setState({currentId: "1"})
//     const form = wrapper.find('#handleSubmit')
//     expect(form.length).to.equal(1)
//     // console.log(wrapper.state().employee)
//     form.simulate('submit', { preventDefault() {} })
//     expect(wrapper.state().employee).to.be.deep.equal({doesNotExist: true})
// })
})
