import React, { useState, useEffect } from 'react'
import { 
  ChevronDown, 
  ChevronUp, 
  Printer, 
  Download, 
  Share2, 
  Edit, 
  Trash2,
  ArrowLeft
} from 'lucide-react'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { fetchProcurementDetails } from '@/api/axios'

const ProcurementDetails = ({ procurements }) => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [procurement, setProcurement] = useState(null)
  console.log(procurement)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProcurementDetails(id)
        console.log(data)
        setProcurement(data)
      } catch (error) {
        console.error('Error fetching procurement details:', error)
      }
    }
    fetchData()
  }, [id])

  const [expandedSections, setExpandedSections] = useState({
    supplier: true,
    items: true,
    equipment: true
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'PPpp')
  }

  return (
    <div className="space-y-6">
      <Button 
        variant="outline" 
        onClick={() => navigate(-1)}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Procurements
      </Button>

      <Card className="overflow-hidden">
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">
                Procurement #{procurement?.id}
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                {/* Created on {formatDate(procurement?.created_at)} */}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Printer className="h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Summary Section */}
          <div className="p-6 border-b">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Procurement Date</h3>
                <p className="mt-1 text-sm font-medium">
                  {/* {formatDate(procurement?.procurement_date)} */}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Logistics Cost</h3>
                <p className="mt-1 text-sm font-medium">
                  {formatCurrency(parseFloat(procurement?.logistics))}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Cost</h3>
                <p className="mt-1 text-lg font-bold text-pink-600">
                  {formatCurrency(parseFloat(procurement?.total_cost))}
                </p>
              </div>
            </div>
          </div>

          {/* Supplier Section */}
          <div className="p-6 border-b">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('supplier')}
            >
              <h2 className="text-lg font-semibold">Supplier Information</h2>
              {expandedSections.supplier ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>
            
            {expandedSections.supplier && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Supplier Name</h3>
                  <p className="mt-1 text-sm">{procurement?.supplier?.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Contact Person</h3>
                  <p className="mt-1 text-sm">{procurement?.supplier?.contact_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Contact Email</h3>
                  <p className="mt-1 text-sm">{procurement?.supplier?.contact_email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                  <p className="mt-1 text-sm">{procurement?.supplier?.contact_phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Address</h3>
                  <p className="mt-1 text-sm">{procurement?.supplier?.address}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Social Media</h3>
                  <p className="mt-1 text-sm">{procurement?.supplier?.socials}</p>
                </div>
              </div>
            )}
          </div>

          {/* Items Section */}
          <div className="p-6 border-b">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('items')}
            >
              <h2 className="text-lg font-semibold">
                Procurement Items ({procurement?.procurement_items?.length})
              </h2>
              {expandedSections.items ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>
            
            {expandedSections.items && (
              <div className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Unit Cost</TableHead>
                      <TableHead className="text-right">Total Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {procurement?.procurement_items?.map((item) => (
                      <TableRow key={item?.id}>
                        <TableCell className="font-medium">
                          {item?.equipment?.name || 'Unknown Equipment'}
                        </TableCell>
                        <TableCell className="text-right">
                          {item?.quantity} {item?.unit}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(parseFloat(item?.unit_cost))}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(parseFloat(item?.total_cost))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {/* Equipment Section */}
          <div className="p-6">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('equipment')}
            >
              <h2 className="text-lg font-semibold">
                Equipment Details ({procurement?.equipment?.length})
              </h2>
              {expandedSections.equipment ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>
            
            {expandedSections.equipment && (
              <div className="mt-4 space-y-6">
                {procurement?.equipment?.map((equip) => (
                  <Card key={equip?.id} className="overflow-hidden">
                    <CardHeader className="bg-gray-50 p-4">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{equip?.name}</CardTitle>
                        <Badge variant="outline">{equip?.model}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Unit Cost</h3>
                        <p className="mt-1">{formatCurrency(parseFloat(equip?.unit_cost))}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Quantity Procured</h3>
                        <p className="mt-1">{equip.pivot.quantity} {equip.pivot.unit}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-4 bg-gray-50 border-t">
          <Button variant="destructive" className="gap-2">
            <Trash2 className="h-4 w-4" />
            Delete Procurement
          </Button>
          <Button className="gap-2 bg-pink-600 hover:bg-pink-700">
            <Edit className="h-4 w-4" />
            Edit Procurement
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default ProcurementDetails