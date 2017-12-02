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
        const { darticlesInstance, defaultAccount, web3 } = this.props
        const balance = await darticlesInstance.getRefundsFor.call(defaultAccount)
        this.setState({
            ...this.state,
            balance: web3.fromWei(balance)
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
            const {web3} = this.props
            const amountInWei = web3.toWei(withdrawAmount, 'ether')            
            await darticlesInstance.withdraw(amountInWei, { from: defaultAccount, gas: 5131607, })
            this.fetchBalance()
        } catch (error) {
            console.log(`Something went wrong when trying to withdraw ether. Error => ${error}`)
        }
    }


    async onWithdrawAllClick() {
        const { balance } = this.state
        const { darticlesInstance, defaultAccount } = this.props
        try {
            const {web3} = this.props
            const amountInWei = web3.toWei(balance, 'ether')            
            await darticlesInstance.withdraw(amountInWei, { from: defaultAccount, gas: 5131607, })
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
                    <p>Balance: {balance.toString()} ETH</p>
                    <Input type="number" label="Amount (ETH)" onChange={this.onAmountChange.bind(this)} />
                    <br />
                    <Button waves="light" onClick={this.onWithdrawClick.bind(this)} >Withdraw</Button>
                    <Button waves="light" onClick={this.onWithdrawAllClick.bind(this)} >Withdraw All</Button>
                </Col>
                <Col s={1}></Col>
            </Row>
        )
    }

}