import React, { Component } from 'react'
import { Row, Col, Input, Button } from 'react-materialize'

export default class Balance extends Component {

    constructor(props) {
        super(props)

        this.state = {
            balance: 0,
            withdrawAmount: 0
        }
    }

    componentWillMount() {
        this.fetchBalance()
    }

    async fetchBalance() {
        const { darticlesInstance, defaultAccount } = this.props
        const balance = await darticlesInstance.getRefundsFor.call(defaultAccount)
        this.setState({
            ...this.state,
            balance: balance.c[0]
        }) 
    }

    onAmountChange(event) {
        const withdrawAmount = event.target.value
        this.setState({
            ...this.state,
            withdrawAmount
        })
    }

    async onWithdrawClick() {
        const { balance, withdrawAmount } = this.state
        if(balance < withdrawAmount) {
            alert(`You can withdraw ${balance} or less`)
            return
        }
        const { darticlesInstance, defaultAccount } = this.props
        try {
            await darticlesInstance.withdraw(withdrawAmount, { from: defaultAccount })
            this.fetchBalance()
        } catch (error) {
            console.log(`Something went wrong when trying to withdraw ether. Error => ${error}`)
        }
    }

    render() {
        const { balance } = this.state

        return (
            <Row>
                <Col s={1}></Col>
                <Col s={10}>
                    <p>Balance: ${balance}</p>
                    <Input type="number" label="Amount" onChange={this.onAmountChange.bind(this)} />
                    <br />
                    <Button waves="light" onClick={this.onWithdrawClick.bind(this)} >Withdraw</Button>
                </Col>
                <Col s={1}></Col>
            </Row>
        )
    }

}