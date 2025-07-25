import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useReactToPrint } from "react-to-print";
import { fetchProcurementDetails } from '../../api/axios';
import { ToWords } from 'to-words';
import logo from '../../assets/sys.png'

function VoucherForm() {
    const {id} = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const componentRef = useRef();
    const reactToPrintFn = useReactToPrint({
        contentRef: componentRef,
        pageStyle: `
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          @media print {
            body {
              padding: 0;
              margin: 0;
            }
          }
        `
    })
    const toWords = new ToWords({
        localeCode: 'en-NG', 
        converterOptions: {
            currency: true,
            ignoreDecimal: false,
            ignoreZeroCurrency: false,
            doNotAddOnly: false,
            currencyOptions: {
                name: 'Naira',
                plural: 'Naira', 
                symbol: '₦',
                fractionalUnit: {
                    name: 'Kobo',
                    plural: 'Kobo', 
                    symbol: '',
                },
            },
        },
    });

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetchProcurementDetails(id);
                setOrder(response);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);
    function currencyFormat(value) {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
        }).format(value);
    }

    return (
        <div className="p-4">
            <div ref={componentRef} className="p-6 bg-white border border-gray-300 rounded-lg print:p-0 print:border-0">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-xl font-bold"><img src={logo} alt="logo" srcset="" className='w-[40%]' /></h1>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold">DATE: <span className="font-normal">{(order?.created_at)?.split('T')[0]}</span></p>
                        <p className="font-semibold mt-4">DEPARTMENT: <input type="text" className=' border-b uppercase font-bold border-gray-300 outline-none w-32' /></p>
                    </div>
                </div>

                {/* Cheque Number */}
                <div className="mb-4">
                    <p className="font-semibold">CHEQUE/PO/LP NO: <input type="text" className='font-normal border-b border-gray-300 outline-none w-32' /></p>
                </div>

                {/* Description Table */}
                <div className="mb-4 overflow-x-auto">
                    <table className="w-full border border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                {['DETAILED DESCRIPTION', 'UNIT PRICE', 'AMOUNT'].map((header, idx) => (
                                    <th key={idx} className="border border-gray-300 p-2 text-left font-semibold text-sm">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {order?.procurement_items?.map((item, idx) => {
                                const equipment = order?.equipment?.find(
                                    eq => eq.id === item.equipment_id
                                );
                                const description = equipment?.equipment_type?.description;
                                return (
                                    <tr key={idx}>
                                        <td className="border border-gray-300 p-2 text-sm">
                                            <span className="block max-w-xs truncate">{description}</span>
                                        </td>
                                        <td className="border border-gray-300 p-2 text-sm text-right">{currencyFormat(item.unit_cost)}</td>
                                        <td className="border border-gray-300 p-2 text-sm text-right">{currencyFormat(item.total_cost)}</td>
                                    </tr>
                                )
                            })}
                            <tr>
                                <td className="border border-gray-300 p-2 text-sm font-bold">Total</td>
                                <td className="border border-gray-300 p-2 text-sm text-right"></td>
                                <td className="border border-gray-300 p-2 text-sm text-right font-bold">{currencyFormat(order?.total_cost ?? 0)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Debit / Credit */}
                <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { label: 'ACCOUNT TO DEBIT/BANK:', placeholder: '' },
                        { label: 'ACCOUNT TO CREDIT/BANK:', placeholder: '' },
                    ].map((field, idx) => (
                        <div key={idx} className="mb-2">
                            <p className="font-semibold text-sm mb-1">{field.label}</p>
                            <input type="text" className="w-full border-b border-gray-300 p-1 outline-none" placeholder={field.placeholder} />
                        </div>
                    ))}
                </div>

                {/* Signatories */}
                <div className="mb-4 overflow-x-auto">
                    <table className="w-full border border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                {['PREPARED BY', 'AUTHORISED BY', 'AUTHORISED SIGN', 'RECEIVED BY', 'DATE', 'SIGNATURE'].map((header, idx) => (
                                    <th key={idx} className="border border-gray-300 p-2 text-left font-semibold text-sm">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {['', 'ABIOLA ADEKOLA', '', '', new Date().toLocaleDateString(), ''].map((item, idx) => (
                                    <td key={idx} className="border border-gray-300 p-2 h-8">
                                        {item === '' ? 
                                            <input type="text" className="w-full border-b border-gray-300 outline-none" /> : 
                                            <span className="text-sm">{item}</span>
                                        }
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Total */}
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                    <div className="flex-1">
                        <p className="font-semibold text-sm mb-1">TOTAL IN WORD:</p>
                        <p className="border border-gray-300 p-2 text-sm min-h-12">
                            {order?.total_cost ? toWords.convert(Number(order?.total_cost), {currency: 'NGN'}) : ''}
                        </p>
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-sm mb-1">TOTAL:</p>
                        <p className="border border-gray-300 p-2 text-sm">{currencyFormat(order?.total_cost ?? 0)}</p>
                    </div>
                </div>

                {/* Note */}
                    <p className="text-xs mt-2 italic font-bold text-gray-500 text-center">Kindly Attach Receipt</p>
                <p className="text-xs mt-2 italic text-gray-500 text-center">
                    Note: Only within the state transport expenses are allowed for transport expenses. Only the Admin Department is exempted.
                </p>
            </div>
            <button 
                onClick={reactToPrintFn} 
                className="mt-4 bg-pink-600 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-pink-700 print:hidden"
            >
                Print Voucher
            </button>
        </div>
    );
}

export default VoucherForm;