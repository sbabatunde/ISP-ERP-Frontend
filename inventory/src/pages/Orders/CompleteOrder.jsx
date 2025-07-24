import React from 'react'
import Page from './components/page'
import { useState, useEffect } from 'react'
import { fetchOrdersList } from '@/api/axios'


function CompleteOrder() {
    const [completeOrders, setCompleteOrders] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true)
                const response = await fetchOrdersList()
                setCompleteOrders(response.filter(order => order.status === 'approved')) 
            } catch (error) {
                console.error('Error fetching orders:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [])


  return (
        <Page title="Complete Orders" orders={completeOrders} loading={loading} />
  )
}

export default CompleteOrder