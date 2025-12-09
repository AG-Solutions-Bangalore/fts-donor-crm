import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { 
  Search, Filter, ChevronDown, ChevronUp, Download, Eye, 
  Edit, Trash2, ChevronLeft, ChevronRight, Columns, 
  RefreshCw, Receipt as ReceiptIcon, Calendar, CreditCard, 
  Building, User, FileText, CheckCircle, XCircle, ArrowUpDown,
  X
} from 'lucide-react';

const ReceiptList = () => {
  const token = Cookies.get("token");
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [showColumnFilter, setShowColumnFilter] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const dropdownRef = useRef(null);
  
  // Available columns with their display names
  const columns = [
    { key: 'receipt_no', label: 'Receipt No', visible: true,  },

    { key: 'receipt_date', label: 'Date', visible: true,  },
    { key: 'receipt_total_amount', label: 'Amount', visible: true, },
    { key: 'receipt_donation_type', label: 'Donation Type', visible: true,  },
    { key: 'receipt_exemption_type', label: 'Exemption', visible: true,  },
    { key: 'tally_status', label: 'Tally Status', visible: true,  },
   
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowColumnFilter(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch receipts data
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['receipts', currentPage, perPage, debouncedSearch],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        per_page: perPage.toString(),
        search: debouncedSearch
      });

      const response = await fetch(
        `https://agstest.in/api2/public/api/fetch-donor-receipts-list?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (!response.ok) throw new Error('Failed to fetch receipts');
      return response.json();
    }
  });

  // Handle column visibility toggle
  const toggleColumn = (key) => {
    setHiddenColumns(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= data?.data?.last_page) {
      setCurrentPage(page);
    }
  };

  // Get visible columns
  const visibleColumns = columns.filter(col => !hiddenColumns[col.key]);

  // Shimmer component
  const ShimmerRow = () => (
    <tr className="animate-pulse">
      {visibleColumns.map((_, index) => (
        <td key={index} className="px-6 py-4">
          <div className="h-4 bg-gray-200 rounded"></div>
        </td>
      ))}
      <td className="px-6 py-4">
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
      </td>
    </tr>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-100 to-amber-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 shadow-lg max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="px-6 py-2 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4 inline-block mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const receipts = data?.data?.data || [];
  const pagination = data?.data || {};

  return (
    <div>
      <div className="px-4 md:px-8 pb-8 mx-auto">
        <div className="bg-gradient-to-br from-gray-100 to-amber-50 rounded-[2rem] md:rounded-[3rem] p-4 md:p-8 shadow-lg">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Receipts Management</h1>
                <p className="text-gray-600">
                  Total {pagination.total || 0} receipts • Page {pagination.current_page || 1} of {pagination.last_page || 1}
                </p>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search receipts by number, donor name, or reference..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <select
                      value={perPage}
                      onChange={(e) => setPerPage(Number(e.target.value))}
                      className="appearance-none pl-4 pr-10 py-3 bg-white border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    >
                      <option value="5">5 per page</option>
                      <option value="10">10 per page</option>
                      <option value="25">25 per page</option>
                      <option value="50">50 per page</option>
                      <option value="100">100 per page</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                  
                  {/* Filter Button with Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setShowColumnFilter(!showColumnFilter)}
                      className="p-3 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                    >
                      <Filter className="w-5 h-5 text-gray-700" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {showColumnFilter && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-lg border border-gray-200 py-4 z-50">
                        <div className="flex items-center justify-between px-4 mb-3">
                          <h3 className="text-sm font-semibold text-gray-900">Show/Hide Columns</h3>
                          <button
                            onClick={() => setShowColumnFilter(false)}
                            className="p-1 hover:bg-gray-100 rounded-lg"
                          >
                            <X className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                        <div className="max-h-64 overflow-y-auto px-4">
                          {columns.map((column) => (
                            <label
                              key={column.key}
                              className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer mb-1"
                            >
                              <input
                                type="checkbox"
                                checked={!hiddenColumns[column.key]}
                                onChange={() => toggleColumn(column.key)}
                                className="w-4 h-4 text-gray-900 rounded border-gray-300 focus:ring-gray-900"
                              />
                              <span className="text-sm text-gray-700">{column.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden scrollbar-custom">
            {/* Table Header */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {visibleColumns.map((column) => (
                      <th
                        key={column.key}
                        className={`px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors ${column.width}`}
                        onClick={() => handleSort(column.key)}
                      >
                        <div className="flex items-center gap-2">
                          {column.label}
                          {sortConfig.key === column.key ? (
                            sortConfig.direction === 'asc' ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )
                          ) : (
                            <ArrowUpDown className="w-4 h-4 opacity-50" />
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                
                <tbody className="divide-y divide-gray-100">
                  {isLoading ? (
                    // Show shimmer rows when loading
                    Array.from({ length: perPage }).map((_, index) => (
                      <ShimmerRow key={index} />
                    ))
                  ) : receipts.length > 0 ? (
                    receipts.map((receipt) => (
                      <tr key={receipt.id} className="hover:bg-gray-50 transition-colors">
                        {visibleColumns.map((column) => (
                          <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {column.key === 'receipt_date' ? (
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-gray-400" />
                                  {formatDate(receipt[column.key])}
                                </div>
                              ) : column.key === 'receipt_total_amount' ? (
                                <div className="font-semibold">
                                  {formatCurrency(parseFloat(receipt[column.key]))}
                                </div>
                              ) : column.key === 'tally_status' ? (
                                <div className="flex items-center gap-2">
                                  {receipt[column.key] === 'True' ? (
                                    <>
                                      <CheckCircle className="w-4 h-4 text-green-500" />
                                      <span className="text-green-700">Synced</span>
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="w-4 h-4 text-amber-500" />
                                      <span className="text-amber-700">Pending</span>
                                    </>
                                  )}
                                </div>
                              ) : column.key === 'receipt_donation_type' ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {receipt[column.key]}
                                </span>
                              ) : column.key === 'receipt_exemption_type' ? (
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                  receipt[column.key] === '80G' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {receipt[column.key]}
                                </span>
                              ) : (
                                receipt[column.key] || 'N/A'
                              )}
                            </div>
                          </td>
                        ))}
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View">
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={visibleColumns.length + 1} className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <ReceiptIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p className="text-lg font-medium mb-2">No receipts found</p>
                          <p className="text-sm">
                            {debouncedSearch 
                              ? `No receipts match "${debouncedSearch}"` 
                              : 'Start by creating your first receipt'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.total > 0 && (
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{pagination.from || 0}</span> to{' '}
                    <span className="font-medium">{pagination.to || 0}</span> of{' '}
                    <span className="font-medium">{pagination.total || 0}</span> receipts
                  </div>

                  <div className='flex flex-row items-center gap-4'>
                    <div>
                      <div className="text-lg font-bold text-center text-gray-900">
                        {isLoading ? (
                          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                        ) : (
                          formatCurrency(receipts.reduce((sum, r) => sum + parseFloat(r.receipt_total_amount || 0), 0))
                        )}
                      </div>
                      <div className="text-sm text-gray-600">Total Amount</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-center text-gray-900">
                        {isLoading ? (
                          <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                        ) : (
                          receipts.filter(r => r.tally_status === 'True').length
                        )}
                      </div>
                      <div className="text-sm text-gray-600">Tally Synced</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!pagination.prev_page_url || isLoading}
                      className={`p-2 rounded-lg transition-colors ${
                        pagination.prev_page_url && !isLoading
                          ? 'hover:bg-white text-gray-700'
                          : 'text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {isLoading ? (
                        <div className="flex items-center gap-1">
                          {[1, 2, 3].map((_, index) => (
                            <div key={index} className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                          ))}
                        </div>
                      ) : (
                        [...Array(pagination.last_page || 1)].map((_, i) => {
                          const pageNumber = i + 1;
                          if (
                            pageNumber === 1 ||
                            pageNumber === pagination.last_page ||
                            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                          ) {
                            return (
                              <button
                                key={pageNumber}
                                onClick={() => handlePageChange(pageNumber)}
                                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                                  currentPage === pageNumber
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-700 hover:bg-white'
                                }`}
                              >
                                {pageNumber}
                              </button>
                            );
                          } else if (
                            pageNumber === currentPage - 2 ||
                            pageNumber === currentPage + 2
                          ) {
                            return (
                              <span key={pageNumber} className="px-2 text-gray-500">
                                ...
                              </span>
                            );
                          }
                          return null;
                        })
                      )}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!pagination.next_page_url || isLoading}
                      className={`p-2 rounded-lg transition-colors ${
                        pagination.next_page_url && !isLoading
                          ? 'hover:bg-white text-gray-700'
                          : 'text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptList;