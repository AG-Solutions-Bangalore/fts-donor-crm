import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { 
  Search, Filter, ChevronDown, ChevronUp, Download, Eye, 
  Edit, Trash2, ChevronLeft, ChevronRight, Columns, 
  RefreshCw, School as SchoolIcon, Calendar, Building, 
  User, FileText, CheckCircle, XCircle, ArrowUpDown,
  X, Hash, CalendarDays, Users, BookOpen, MapPin,
  ArrowLeft, Globe, Navigation, Home, Map
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';

const SchoolView = () => {
  const { id } = useParams();
  const token = Cookies.get("token");
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [showColumnFilter, setShowColumnFilter] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Available columns with their display names
  const columns = [
    { key: 'school_code', label: 'School Code', visible: true },
    { key: 'village', label: 'Village', visible: true },
    { key: 'district', label: 'District', visible: true },
    { key: 'school_state', label: 'State', visible: true },
    { key: 'achal', label: 'Achal', visible: true },
    { key: 'cluster', label: 'Cluster', visible: true },
    { key: 'sub_cluster', label: 'Sub Cluster', visible: true },
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

  // Fetch school details data
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['schoolView', id, currentPage, perPage, debouncedSearch],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        per_page: perPage.toString(),
        search: debouncedSearch
      });

      const response = await fetch(
        `https://agstest.in/api2/public/api/fetch-school-alloted-view-by-id/${id}?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (!response.ok) throw new Error('Failed to fetch school details');
      return response.json();
    },
    enabled: !!id, // Only fetch if id exists
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

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= data?.data?.last_page) {
      setCurrentPage(page);
    }
  };

  // Go back to schools list
  const handleBackToList = () => {
    navigate('/school');
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
      <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-100 to-blue-50 flex items-center justify-center">
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

  const schools = data?.data?.data || [];
  const pagination = data?.data || {};

  return (
    <div>
      <div className="px-4 md:px-8 pb-8 mx-auto">
        <div className="bg-gradient-to-br from-gray-100 to-blue-50 rounded-[2rem] md:rounded-[3rem] p-4 md:p-8 shadow-lg">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={handleBackToList}
                    className="p-2 hover:bg-white rounded-full transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                      School Details - Allotment ID: {id}
                    </h1>
                    <p className="text-gray-600">
                      Total {pagination.total || 0} schools • Page {pagination.current_page || 1} of {pagination.last_page || 1}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by school code, village, district, or state..."
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
                        className={`px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors`}
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
                  
                  </tr>
                </thead>
                
                <tbody className="divide-y divide-gray-100">
                  {isLoading ? (
                    // Show shimmer rows when loading
                    Array.from({ length: perPage }).map((_, index) => (
                      <ShimmerRow key={index} />
                    ))
                  ) : schools.length > 0 ? (
                    schools.map((school) => (
                      <tr key={school.id} className="hover:bg-gray-50 transition-colors">
                        {visibleColumns.map((column) => (
                          <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {column.key === 'school_code' ? (
                                <div className="flex items-center gap-2">
                                  <Hash className="w-4 h-4 text-gray-400" />
                                  <span className="font-mono font-medium">{school[column.key]}</span>
                                </div>
                              ) : column.key === 'village' ? (
                                <div className="flex items-center gap-2">
                                  <Home className="w-4 h-4 text-gray-400" />
                                  <span className="font-medium">{school[column.key]}</span>
                                </div>
                              ) : column.key === 'district' ? (
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-gray-400" />
                                  <span>{school[column.key]}</span>
                                </div>
                              ) : column.key === 'school_state' ? (
                                <div className="flex items-center gap-2">
                                  <Globe className="w-4 h-4 text-gray-400" />
                                  <span>{school[column.key]}</span>
                                </div>
                              ) : column.key === 'achal' ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  <User className="w-3 h-3 mr-1" />
                                  {school[column.key]}
                                </span>
                              ) : column.key === 'cluster' ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <Building className="w-3 h-3 mr-1" />
                                  {school[column.key]}
                                </span>
                              ) : column.key === 'sub_cluster' ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                  <Navigation className="w-3 h-3 mr-1" />
                                  {school[column.key]}
                                </span>
                              ) : (
                                school[column.key] || 'N/A'
                              )}
                            </div>
                          </td>
                        ))}
                        
                      
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={visibleColumns.length + 1} className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <SchoolIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p className="text-lg font-medium mb-2">No school details found</p>
                          <p className="text-sm">
                            {debouncedSearch 
                              ? `No schools match "${debouncedSearch}"` 
                              : 'No schools are allotted to this ID'}
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
                    <span className="font-medium">{pagination.total || 0}</span> schools
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

export default SchoolView;