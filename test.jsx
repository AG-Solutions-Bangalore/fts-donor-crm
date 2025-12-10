import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, TrendingUp, Briefcase, ArrowUpRight, Phone, Mail, 
  MapPin, Calendar, CreditCard, Building2, UserCircle, 
  Heart, Receipt, CheckCircle, BarChart3, Clock, ChevronRight,
  Sparkles
} from 'lucide-react';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const cardVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.02,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 15 
      }
    },
    tap: { scale: 0.98 }
  };

  const statVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      rotate: 2,
      transition: { 
        type: "spring", 
        stiffness: 400 
      }
    }
  };

  const pulseVariants = {
    initial: { scale: 1 },
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-100 to-amber-50 flex items-center justify-center"
      >
        <div className="text-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-gray-900 border-t-amber-400 rounded-full mx-auto mb-4"
          />
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-gray-600 font-medium"
          >
            Loading donor information...
          </motion.p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-100 to-amber-50 flex items-center justify-center"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 shadow-lg max-w-md"
        >
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
            className="text-red-500 text-5xl mb-4"
          >
            ⚠️
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600">{error.message}</p>
        </motion.div>
      </motion.div>
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
    <motion.main 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="px-4 md:px-8 pb-8 mx-auto"
    >
      <motion.div 
        variants={itemVariants}
        className="bg-gradient-to-br from-gray-100 to-amber-50 rounded-[2rem] md:rounded-[3rem] p-4 md:p-8 shadow-lg"
      >
        {/* Header */}
        <motion.div 
          variants={itemVariants}
          className="mb-8 flex flex-col lg:flex-row items-center justify-between"
        >
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Welcome, {individualCompany.title}  {individualCompany.indicomp_full_name}
              </h1>
              <div className="text-gray-600 flex flex-wrap items-center gap-2 text-lg">
                <motion.div 
                  variants={statVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-gray-900 to-gray-800 text-white text-sm font-medium shadow-md"
                >
                  {individualCompany.indicomp_type || 'N/A'}
                </motion.div>
                <motion.div 
                  variants={statVariants}
                  whileHover="hover"
                  whileTap="tap"
                  animate="pulse"
                  variants={{
                    ...statVariants,
                    pulse: { 
                      scale: [1, 1.05, 1],
                      transition: { duration: 1.5, repeat: Infinity }
                    }
                  }}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 text-sm font-medium shadow-md"
                >
                  {individualCompany.indicomp_status}
                </motion.div>
                <motion.div 
                  variants={statVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-300 to-blue-400 text-gray-900 text-sm font-medium shadow-md"
                >
                  {individualCompany.indicomp_source || 'Direct'}
                </motion.div>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-6 mt-6"
          >
            {[
              { icon: Users, value: totalFamilyMembers, label: 'Family Members', color: 'from-blue-500 to-blue-600' },
              { icon: Building2, value: totalCompanies, label: 'Companies', color: 'from-purple-500 to-purple-600' },
              { icon: Receipt, value: totalReceipts, label: 'Receipts', color: 'from-emerald-500 to-emerald-600' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={statVariants}
                whileHover="hover"
                whileTap="tap"
                className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <stat.icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                </motion.div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-600">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Main Grid */}
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {/* Primary Donor Profile */}
          <motion.div 
            variants={itemVariants}
            className="lg:row-span-2"
          >
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
              className="bg-white rounded-3xl p-6 shadow-sm h-full flex flex-col border border-gray-200/50"
            >
              <div className="relative mb-6">
                <motion.img
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  src={getImageUrl(individualCompany.indicomp_image_logo)}
                  alt={individualCompany.indicomp_full_name}
                  className="w-full h-48 object-cover rounded-2xl shadow-md"
                  onError={(e) => {
                    e.target.src = image_url.find(img => img.image_for === "No Image")?.image_url;
                  }}
                />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="absolute bottom-4 right-4 bg-gradient-to-r from-gray-800 to-gray-900 backdrop-blur-sm px-4 py-1 rounded-full text-white text-sm shadow-lg"
                >
                  FTS ID: {individualCompany.indicomp_fts_id}
                </motion.div>
              </div>

              <div className="space-y-3 flex-1">
                {[
                  { icon: Phone, label: 'Mobile', value: individualCompany.indicomp_mobile_phone },
                  { icon: Mail, label: 'Email', value: individualCompany.indicomp_email },
                  { icon: MapPin, label: 'Location', value: `${individualCompany.indicomp_res_reg_city}, ${individualCompany.indicomp_res_reg_state}` },
                  { icon: CreditCard, label: 'PAN Number', value: individualCompany.indicomp_pan_no },
                  ...(individualCompany.indicomp_dob_annualday ? [
                    { icon: Calendar, label: 'Date of Birth', value: new Date(individualCompany.indicomp_dob_annualday).toLocaleDateString() }
                  ] : [])
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (index * 0.1) }}
                    variants={cardVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200/50 shadow-sm"
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0"
                    >
                      <item.icon className="w-4 h-4 text-gray-600" />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-600">{item.label}</div>
                      <div className="text-sm font-medium text-gray-900 truncate">{item.value}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Donation Summary */}
          <motion.div variants={itemVariants}>
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
              className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-6 shadow-lg text-white"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <motion.h3 
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-lg font-semibold mb-1"
                  >
                    Total Donations
                  </motion.h3>
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="text-3xl md:text-4xl font-bold"
                  >
                    ₹{totalDonations.toLocaleString()}
                  </motion.div>
                  <div className="text-sm opacity-90">Lifetime contributions</div>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Heart className="w-8 h-8" fill="currentColor" />
                </motion.div>
              </div>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-2 text-sm opacity-90"
              >
                <Receipt className="w-4 h-4" />
                <span>{totalReceipts} receipts issued</span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Membership Details */}
          <motion.div variants={itemVariants}>
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
              className="bg-white rounded-3xl p-2 shadow-sm border border-gray-200/50"
            >
              {membership_details.length > 0 ? (
                <div className="space-y-3">
                  {membership_details.slice(0, 1).map((membership, index) => (
                    <motion.div
                      key={membership.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + (index * 0.1) }}
                      variants={cardVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className="p-4 bg-gradient-to-br from-yellow-900 to-yellow-800 rounded-2xl text-white shadow-lg"
                    >
                      <div className='flex border-b border-white/20 flex-row items-center justify-between pb-2 mb-3'>
                        <h3 className="text-lg font-semibold">Membership</h3>
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4 text-yellow-400" />
                          <span className="text-xs font-medium">{membership.receipt_donation_type}</span>
                        </motion.div>
                      </div>
                      <div className="space-y-2">
                        <motion.div 
                          className="flex items-center justify-between"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <span className="text-sm opacity-80">Receipt No.</span>
                          <span className="font-semibold">{membership.receipt_no}</span>
                        </motion.div>
                        <motion.div 
                          className="flex items-center justify-between"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <span className="text-sm opacity-80">Amount</span>
                          <motion.span 
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="font-bold text-lg"
                          >
                            ₹{parseFloat(membership.receipt_total_amount).toLocaleString()}
                          </motion.span>
                        </motion.div>
                        <motion.div 
                          className="flex items-center justify-between"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          <span className="text-sm opacity-80">Valid Until</span>
                          <span className="font-semibold">{membership.m_ship_vailidity}</span>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-gray-500"
                >
                  <UserCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No membership details</p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          {/* Family Members */}
          <motion.div 
            variants={itemVariants}
            className="lg:row-span-2"
          >
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
              className="bg-white rounded-3xl p-6 shadow-sm h-full flex flex-col border border-gray-200/50"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Family Members</h3>
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                  className="text-2xl font-bold text-gray-900"
                >
                  {totalFamilyMembers}
                </motion.span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto pr-2">
                <AnimatePresence>
                  {family_details.map((member, index) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      variants={cardVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200/50 hover:border-gray-300 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <motion.img
                          whileHover={{ scale: 1.1 }}
                          src={getImageUrl(member.indicomp_image_logo)}
                          alt={member.indicomp_full_name}
                          className="w-12 h-12 rounded-full object-cover shadow-sm"
                          onError={(e) => {
                            e.target.src = image_url.find(img => img.image_for === "No Image")?.image_url;
                          }}
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{member.title} {member.indicomp_full_name}</div>
                          <div className="text-sm text-gray-600">{member.indicomp_gender} • {member.indicomp_type}</div>
                          <div className="text-xs text-gray-500 mt-1">{member.indicomp_mobile_phone}</div>
                          {member.indicomp_belongs_to && (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="mt-2"
                            >
                              <motion.span
                                whileHover={{ scale: 1.05 }}
                                className="text-xs bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 px-2 py-1 rounded-full font-medium"
                              >
                                {member.indicomp_belongs_to}
                              </motion.span>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
                className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-4 md:p-6 text-white shadow-lg mt-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Recent Activity</h3>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Clock className="w-5 h-5" />
                  </motion.div>
                </div>
                <div className="space-y-3">
                  {[
                    { color: 'bg-green-400', label: 'Last Login', value: individualCompany.last_login ? formatDate(individualCompany.last_login) : 'Never' },
                    { color: 'bg-yellow-400', label: 'Last Updated', value: formatDate(individualCompany.updated_at) },
                    { color: 'bg-blue-400', label: 'Joining Date', value: formatDate(individualCompany.indicomp_joining_date) }
                  ].map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + (index * 0.1) }}
                      className="flex items-center gap-3"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.3 }}
                        className={`w-2 h-2 ${activity.color} rounded-full`}
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{activity.label}</div>
                        <div className="text-xs opacity-80">{activity.value}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Recent Receipts */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-2"
          >
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/50"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Receipts</h3>
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                  className="text-2xl font-bold text-gray-900"
                >
                  {totalReceipts}
                </motion.span>
              </div>
              
              {donor_receipts.length > 0 ? (
                <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-custom">
                  {donor_receipts.map((receipt, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -5 }}
                      className="flex-shrink-0 w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)]"
                    >
                      <motion.div
                        variants={cardVariants}
                        whileHover="hover"
                        whileTap="tap"
                        className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200/50 hover:border-amber-300 shadow-sm"
                      >
                        <div className="flex flex-col">
                          <div className="flex items-start gap-3 mb-3">
                            <motion.div
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Receipt className="w-5 h-5 text-amber-700" />
                            </motion.div>
                            <div className="font-semibold text-gray-900">Receipt : {receipt.receipt_no}</div>
                          </div>
                          <div className="flex flex-row items-center justify-between">
                            <div>
                              <div className="text-sm text-gray-600 truncate">{receipt.indicomp_full_name}</div>
                              <div className="text-xs text-gray-500">
                                {new Date(receipt.receipt_date).toLocaleDateString()}
                              </div>
                            </div>
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 1, repeat: Infinity, delay: index * 0.2 }}
                              className="text-lg font-bold text-amber-800"
                            >
                              ₹{parseFloat(receipt.receipt_total_amount).toLocaleString()}
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No receipts found</p>
                </motion.div>
              )}
            </motion.div>

            {/* Associated Companies */}
            <motion.div 
              variants={itemVariants}
              className="mt-4 md:mt-6"
            >
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/50"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Associated Companies</h3>
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                    className="text-2xl font-bold text-gray-900"
                  >
                    {totalCompanies}
                  </motion.span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {company_details.map((company, index) => (
                    <motion.div
                      key={company.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      variants={cardVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className="p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl text-white shadow-lg"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Building2 className="w-5 h-5 text-yellow-400 mt-1" />
                        </motion.div>
                        <div className="flex-1">
                          <motion.div 
                            whileHover={{ scale: 1.02 }}
                            className="font-semibold text-lg mb-1"
                          >
                            {company.indicomp_full_name}
                          </motion.div>
                          <div className="text-sm opacity-80">{company.indicomp_com_contact_name}</div>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="flex items-center gap-2"
                        >
                          <Phone className="w-3 h-3 text-yellow-400" />
                          <span className="opacity-80">{company.indicomp_mobile_phone}</span>
                        </motion.div>
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                          className="flex items-center gap-2"
                        >
                          <MapPin className="w-3 h-3 text-yellow-400" />
                          <span className="opacity-80">{company.indicomp_res_reg_city}, {company.indicomp_res_reg_state}</span>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.main>
  );
};

export default DonorDashboard;