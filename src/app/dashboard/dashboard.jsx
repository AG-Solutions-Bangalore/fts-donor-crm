import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, TrendingUp, Briefcase, ArrowUpRight, Phone, Mail, MapPin, Calendar, CreditCard, Building2, UserCircle, Heart, Receipt, CheckCircle, BarChart3, Clock } from 'lucide-react';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';




const DonorDashboard = () => {
      const token = Cookies.get("token");
  const { data, isLoading, error } = useQuery({
    queryKey: ['donorData'],
    
    queryFn: async () => {
      const response = await fetch('https://agstest.in/api2/public/api/fetch-donors-view',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      if (!response.ok) throw new Error('Failed to fetch data');
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-100 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-900 border-t-amber-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading donor information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-100 to-amber-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 shadow-lg max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  const { individualCompany, family_details = [], company_details = [], donor_receipts = [], membership_details = [], image_url = [] } = data;
  
  const getImageUrl = (imageName) => {
    if (!imageName) return image_url.find(img => img.image_for === "No Image")?.image_url;
    const donorImageBase = image_url.find(img => img.image_for === "Donor")?.image_url;
    return `${donorImageBase}${imageName}`;
  };

  const totalFamilyMembers = family_details.length;
  const totalCompanies = company_details.length;
  const totalReceipts = donor_receipts.length;
  const totalDonations = donor_receipts.reduce((sum, receipt) => sum + parseFloat(receipt.receipt_total_amount || 0), 0);
  const formatDate = (dateString) => {
    if (!dateString || dateString === '0000-00-00') return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  return (
    <>
     
      <main className=" px-8 pb-8 mx-auto">
        <div className="bg-gradient-to-br from-gray-100 to-amber-50 rounded-[3rem] p-8 shadow-lg">
          <div className="mb-8 flex flex-col lg:flex-row items-center justify-between">
           <div>
           <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome, {individualCompany.title}  {individualCompany.indicomp_full_name}
            </h1>
            <div className="text-gray-600 flex flex-row items-center gap-2 text-lg"> 
              
              
            <div className="px-6 py-2 rounded-full bg-gray-900 text-white text-sm font-medium">
                  {individualCompany.indicomp_type || 'N/A'}
                </div>   <div className="px-6 py-2 rounded-full bg-yellow-400 text-gray-900 text-sm font-medium">
                  {individualCompany.indicomp_status}
                </div>    <div className="px-6 py-2 rounded-full bg-blue-200 text-gray-900 text-sm font-medium">
                  {individualCompany.indicomp_source || 'Direct'}
                </div>  </div>

           </div>
           <div className="flex gap-8 mt-6">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="text-4xl font-bold text-gray-900">{totalFamilyMembers}</div>
                  <div className="text-sm text-gray-600">Family Members</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="text-4xl font-bold text-gray-900">{totalCompanies}</div>
                  <div className="text-sm text-gray-600">Companies</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Receipt className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="text-4xl font-bold text-gray-900">{totalReceipts}</div>
                  <div className="text-sm text-gray-600">Receipts</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Primary Donor Profile */}
            <div className="lg:row-span-2">
              <div className="bg-white rounded-3xl p-6 shadow-sm h-full flex flex-col">
                <div className="relative mb-6">
                  <img
                    src={getImageUrl(individualCompany.indicomp_image_logo)}
                    alt={individualCompany.indicomp_full_name}
                    className="w-full h-48 object-cover rounded-2xl"
                    onError={(e) => {
                      e.target.src = image_url.find(img => img.image_for === "No Image")?.image_url;
                    }}
                  />
                
                  <div className="absolute bottom-4 right-4 bg-gray-800/70 backdrop-blur-sm px-4 py-1 rounded-full text-white text-sm">
                    ID: {individualCompany.indicomp_fts_id}
                  </div>
                </div>

                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-4 h-4 text-gray-600" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-600">Mobile</div>
                      <div className="text-sm font-medium text-gray-900">{individualCompany.indicomp_mobile_phone}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-4 h-4 text-gray-600" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-600">Email</div>
                      <div className="text-sm font-medium text-gray-900 break-all">{individualCompany.indicomp_email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-600">Location</div>
                      <div className="text-sm font-medium text-gray-900">
                        {individualCompany.indicomp_res_reg_city}, {individualCompany.indicomp_res_reg_state}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <CreditCard className="w-4 h-4 text-gray-600" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-600">PAN Number</div>
                      <div className="text-sm font-medium text-gray-900">{individualCompany.indicomp_pan_no}</div>
                    </div>
                  </div>

                  {individualCompany.indicomp_dob_annualday && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <div className="flex-1">
                        <div className="text-xs text-gray-600">Date of Birth</div>
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(individualCompany.indicomp_dob_annualday).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Donation Summary */}
            <div>
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Donations</h3>
                    <div className="text-3xl font-bold text-gray-900">₹{totalDonations.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Lifetime contributions</div>
                  </div>
                  <Heart className="w-8 h-8 text-red-500" fill="currentColor" />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Receipt className="w-4 h-4" />
                  <span>{totalReceipts} receipts issued</span>
                </div>
              </div>
            </div>

            {/* Membership Details */}
            <div>
              <div className="bg-white rounded-3xl p-2 shadow-sm">
                
                {membership_details.length > 0 ? (
                  <div className="space-y-3">
                    {membership_details.slice(0, 1).map((membership) => (
                      <div key={membership.id} className="p-4 bg-gradient-to-br from-yellow-900 to-yellow-700 rounded-xl text-white">
                        <div className='flex  border-b border-white/20 flex-row items-center justify-between'>
                        <h3 className="text-lg font-semibold text-white ">Membership</h3>
                        <div className="flex   items-center gap-2 ">
                          <CheckCircle className="w-4 h-4 text-yellow-400" />
                          <span className="text-xs">{membership.receipt_donation_type}</span>
                        </div>



                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm opacity-80">Receipt No.</span>
                          <span className="font-semibold">{membership.receipt_no}</span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm opacity-80">Amount</span>
                          <span className="font-bold text-lg">₹{parseFloat(membership.receipt_total_amount).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm opacity-80">Valid Until</span>
                          <span className="font-semibold">{membership.m_ship_vailidity}</span>
                        </div>
                       
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <UserCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No membership details</p>
                  </div>
                )}
              </div>
            </div>

            {/* Family Members */}
            <div className="lg:row-span-2">
              <div className="bg-white rounded-3xl p-6 shadow-sm h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Family Members</h3>
                  <span className="text-2xl font-bold text-gray-900">{totalFamilyMembers}</span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {family_details.map((member) => (
                    <div key={member.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-start gap-3">
                        <img
                          src={getImageUrl(member.indicomp_image_logo)}
                          alt={member.indicomp_full_name}
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) => {
                            e.target.src = image_url.find(img => img.image_for === "No Image")?.image_url;
                          }}
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{member.title} {member.indicomp_full_name}</div>
                          <div className="text-sm text-gray-600">{member.indicomp_gender} • {member.indicomp_type}</div>
                          <div className="text-xs text-gray-500 mt-1">{member.indicomp_mobile_phone}</div>
                          {member.indicomp_belongs_to && (
                            <div className="mt-2">
                              <span className="text-xs bg-yellow-400 text-gray-900 px-2 py-1 rounded-full">
                                {member.indicomp_belongs_to}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-3xl p-6 text-white">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Recent Activity</h3>
                            <Clock className="w-5 h-5" />
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <div className="flex-1">
                                <div className="text-sm font-medium">Last Login</div>
                                <div className="text-xs opacity-80">
                                  {individualCompany.last_login ? formatDate(individualCompany.last_login) : 'Never'}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                              <div className="flex-1">
                                <div className="text-sm font-medium">Last Updated</div>
                                <div className="text-xs opacity-80">
                                  {formatDate(individualCompany.updated_at)}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                              <div className="flex-1">
                                <div className="text-sm font-medium">Joining Date</div>
                                <div className="text-xs opacity-80">
                                  {formatDate(individualCompany.indicomp_joining_date)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
              </div>

           
            </div>

            {/* Recent Receipts */}
            <div className="lg:col-span-2">
            {/* Recent Receipts */}
{/* Recent Receipts */}
<div className="lg:col-span-2">
  <div className="bg-white rounded-3xl p-6 shadow-sm">
 
    <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Receipts</h3>
                  <span className="text-2xl font-bold text-gray-900">{totalReceipts}</span>
                </div>
    {donor_receipts.length > 0 ? (
      <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-custom">
        {donor_receipts.map((receipt, index) => (
          <div 
            key={index} 
            className="flex-shrink-0 w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)]"
          >
            <div className="p-2 bg-red-50 rounded-xl hover:bg-gray-100 transition-colors ">
              <div className="flex flex-col">
                <div className="flex items-start gap-3 mb-3">
         
                    <Receipt className="w-5 h-5 text-black" />
                    <div className="font-semibold text-gray-900">Receipt : {receipt.receipt_no}</div>
                  
                 
                </div>
                <div className="flex flex-row items-center justify-between ">
                
            <div>
            <div className="text-sm text-gray-600 truncate">{receipt.indicomp_full_name}</div>
                <div className="text-xs text-gray-500">{new Date(receipt.receipt_date).toLocaleDateString()}</div>

            </div>
            
                  <div className="text-lg font-bold text-gray-900">₹{parseFloat(receipt.receipt_total_amount).toLocaleString()}</div>
               
              </div>
             
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8">
        <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500">No receipts found</p>
        
      </div>
    )}
  </div>
</div>
                 {/* Company Details */}
            <div className="lg:col-span-2 mt-4">
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Associated Companies</h3>
                  <span className="text-2xl font-bold text-gray-900">{totalCompanies}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {company_details.map((company) => (
                    <div key={company.id} className="p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl text-white">
                      <div className="flex items-start gap-3 mb-3">
                        <Building2 className="w-5 h-5 text-yellow-400 mt-1" />
                        <div className="flex-1">
                          <div className="font-semibold text-lg mb-1">{company.indicomp_full_name}</div>
                          <div className="text-sm opacity-80">{company.indicomp_com_contact_name}</div>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3" />
                          <span className="opacity-80">{company.indicomp_mobile_phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3" />
                          <span className="opacity-80">{company.indicomp_res_reg_city}, {company.indicomp_res_reg_state}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            </div>

         
          </div>
        
        </div>
      </main>
    </>
  );
};

export default DonorDashboard;