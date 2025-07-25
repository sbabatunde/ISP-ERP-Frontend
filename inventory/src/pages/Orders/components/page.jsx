import React, { useState, useEffect } from 'react';
import { Plus, Eye, Search, Printer, Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLocation, useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

function Page({ title, orders, loading }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [total, setTotal] = useState(0);
    const [hoveredRow, setHoveredRow] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    function handleDate(date) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(date).toLocaleDateString('en-US', options);
    }

    function getStatusBadge(status) {
        const statusMap = {
            'pending': {
                bg: 'bg-amber-50 dark:bg-amber-900/20',
                text: 'text-amber-600 dark:text-amber-300',
                border: 'border-amber-200 dark:border-amber-800'
            },
            'approved': {
                bg: 'bg-emerald-50 dark:bg-emerald-900/20',
                text: 'text-emerald-600 dark:text-emerald-300',
                border: 'border-emerald-200 dark:border-emerald-800'
            },
            'shipped': {
                bg: 'bg-blue-50 dark:bg-blue-900/20',
                text: 'text-blue-600 dark:text-blue-300',
                border: 'border-blue-200 dark:border-blue-800'
            },
            'cancelled': {
                bg: 'bg-rose-50 dark:bg-rose-900/20',
                text: 'text-rose-600 dark:text-rose-300',
                border: 'border-rose-200 dark:border-rose-800'
            }
        };
        const statusData = statusMap[status?.toLowerCase()] || {
            bg: 'bg-gray-50 dark:bg-gray-800',
            text: 'text-gray-600 dark:text-gray-300',
            border: 'border-gray-200 dark:border-gray-700'
        };
        return `${statusData.bg} ${statusData.text} ${statusData.border}`;
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2
        }).format(amount);
    }

    const filteredOrders = orders.filter(order => 
        order?.id?.toString().includes(searchTerm) || 
        order?.status?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        order?.total_cost?.toString().includes(searchTerm)
    );

    useEffect(() => {
        setTotal(filteredOrders.reduce((acc, order) => acc + Number(order.total_cost), 0));
    }, [filteredOrders]);

    return (
        <div className='p-6 space-y-6 bg-gray-50 dark:bg-gray-950 min-h-screen'>
            {/* Header Section */}
            <div className='flex flex-col md:flex-row justify-between items-start md:items-end gap-4'>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">{title}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} • Total value: {formatCurrency(total)}
                    </p>
                </div>
                <div className='flex flex-col sm:flex-row w-full md:w-auto gap-3'>
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <Input 
                            type="text" 
                            placeholder='Search orders by ID, status or amount...'
                            className='pl-10 w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-800 placeholder-gray-400 dark:placeholder-gray-500 focus-visible:ring-2 focus-visible:ring-pink-500 dark:focus-visible:ring-pink-400 focus:border-pink-300 dark:focus:border-pink-600 transition-all duration-200'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button 
                        className='bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 dark:from-pink-700 dark:to-pink-600 dark:hover:from-pink-800 dark:hover:to-pink-700 text-white shadow-lg hover:shadow-pink-500/30 dark:hover:shadow-pink-700/30 flex items-center gap-2 transition-all duration-300'
                        onClick={() => navigate('/create-order')}
                    >
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">New Order</span>
                    </Button>
                </div>
            </div>
            
            {/* Table Container */}
            <div className='rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm bg-white dark:bg-gray-900'>
                <Table className="min-w-full">
                    <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[80px] text-gray-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">#</TableHead>
                            <TableHead className="text-gray-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">Date</TableHead>
                            <TableHead className="text-gray-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">Status</TableHead>
                            <TableHead className="text-right text-gray-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">Amount</TableHead>
                            <TableHead className="text-right text-gray-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-96 text-center align-middle">
                                    <div className="flex flex-col items-center justify-center h-full gap-3">
                                        <Loader2 className="h-12 w-12 text-pink-600 dark:text-pink-400 animate-spin" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredOrders.length > 0 ? (
                            filteredOrders.map((order, index) => (
                                <TableRow 
                                    key={order.id} 
                                    className={`border-t border-gray-100 dark:border-gray-800 transition-all duration-200 ${hoveredRow === order.id ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-900'}`}
                                    onMouseEnter={() => setHoveredRow(order.id)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                >
                                    <TableCell className="font-medium text-gray-900 dark:text-gray-100 py-4">
                                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 dark:bg-gray-800 text-sm font-medium">
                                            {index + 1}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-gray-700 dark:text-gray-300 py-4">
                                        <div className="flex flex-col">
                                            <span>{handleDate(order?.created_at)}</span>
                                            <span className="text-xs text-gray-400 dark:text-gray-500">ID: {order.id}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <Badge 
                                            className={`${getStatusBadge(order?.status)} px-3 py-1 text-xs font-medium rounded-full border uppercase tracking-wide`}
                                        >
                                            {order?.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right text-gray-900 dark:text-gray-100 font-medium py-4">
                                        <div className="flex flex-col items-end">
                                            <span>{formatCurrency(Number(order.total_cost))}</span>
                                            {order.items && (
                                                <span className="text-xs text-gray-400 dark:text-gray-500">
                                                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right py-4">
                                        <div className="flex justify-end gap-2">
                                            <Button 
                                                onClick={() => navigate(`/procurement-details/${order.id}`)} 
                                                variant="ghost" 
                                                size="sm" 
                                                className={`gap-1 cursor-pointer rounded-full p-2 ${hoveredRow === order.id ? 'bg-gray-100 dark:bg-gray-800' : ''} transition-all duration-200`}
                                                aria-label="View order details"
                                            >
                                                <Eye className="h-10 w-10 text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors" />
                                            </Button>
                                            {order.status === 'pending' && (
                                                <>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className={`flex flex-col  gap-1 cursor-pointer rounded-full p-2 ${hoveredRow === order.id ? 'bg-gray-100 dark:bg-gray-800' : ''} transition-all duration-200`}
                                                    aria-label="Print order"
                                                    onClick={() => navigate(`/requisition-form/${order.id}`)}
                                                >
                                                    <span className='text-xs text-gray-600 dark:text-gray-300'>Requisition Form</span> <span className='text-xs text-gray-600 dark:text-gray-300'> <Printer className=" h-4 w-4 text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors" /></span>
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className={`flex flex-col  gap-1 cursor-pointer rounded-full p-2 ${hoveredRow === order.id ? 'bg-gray-100 dark:bg-gray-800' : ''} transition-all duration-200`}
                                                    aria-label="Print order"
                                                    onClick={() => navigate(`/voucher-form/${order.id}`)}
                                                >
                                                    <span className='text-xs text-gray-600 dark:text-gray-300'>Voucher Form</span> <span className='text-xs text-gray-600 dark:text-gray-300'> <Printer className=" h-4 w-4 text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors" /></span>
                                                </Button>
                                                </>
                                                
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={5} className="h-96 text-center">
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <div className="relative mb-6">
                                            <Search className="h-12 w-12 text-gray-300 dark:text-gray-700" />
                                            <div className="absolute -inset-4 rounded-full bg-gray-100 dark:bg-gray-800/50 opacity-60"></div>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            No orders found
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md text-center">
                                            {searchTerm ? 
                                                "No orders match your search criteria. Try adjusting your search term." : 
                                                "There are currently no orders available. Create a new order to get started."}
                                        </p>
                                        {!searchTerm && (
                                            <Button 
                                                className="mt-6 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white"
                                                onClick={() => navigate('/create-order')}
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Create New Order
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Summary Footer */}
                {filteredOrders.length > 0 && !loading && (
                    <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 px-6 py-3">
                        <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Showing {filteredOrders.length} of {orders.length} orders
                            </div>
                            <div className="flex items-center space-x-6">
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Amount:</p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {formatCurrency(total)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Page;