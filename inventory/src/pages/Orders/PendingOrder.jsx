import React from 'react'
import Page from './components/page'
import { useState, useEffect } from 'react'
import { fetchOrdersList } from '@/api/axios'

function PendingOrder() {
    const [pendingOrders, setPendingOrders] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true)
                const response = await fetchOrdersList()
                setPendingOrders(response.filter(order => order.status === 'pending'))
            } catch (error) {
                console.error('Error fetching orders:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [])

   
    return (
    <Page title="Pending Orders" orders={pendingOrders} loading={loading} />
  )
}

export default PendingOrder