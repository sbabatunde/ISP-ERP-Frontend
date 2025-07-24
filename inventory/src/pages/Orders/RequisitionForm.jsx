import React from 'react'
import Preview from './components/preview'
import { fetchProcurementDetails } from '../../api/axios'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

function RequisitionForm() {
  const [loading, setLoading] = useState(true)

  const { id } = useParams()
  console.log(id)
  const [procurement, setProcurement] = useState(null)
  const [error, setError] = useState(null)
  console.log(procurement)

  useEffect(() => {
    const fetchProcurement = async () => {
      const procurement = await fetchProcurementDetails(id)
      setProcurement(procurement)
      setLoading(false)
    }
    fetchProcurement()
  }, [id])
  return (
    <div className=' w-full'>
   
    <div>
        <Preview procurement={procurement} />
    </div>
    </div>
  )
}

export default RequisitionForm