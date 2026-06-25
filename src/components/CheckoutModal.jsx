import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, CreditCard, CheckCircle, Upload, ChevronRight, MapPin as PinIcon, Home, Plus, Edit2, AlertCircle, ImageIcon } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { uploadImage } from '../utils/cloudinary';

const CheckoutModal = ({ isOpen, onClose, total }) => {
  const { userAddresses, addAddress, placeOrder, siteConfig } = useShop();
  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(userAddresses[0] || null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({ name: '', phone: '', addressText: '', city: '', pincode: '' });
  const [transactionId, setTransactionId] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState('');
  const [isUploadingScreenshot, setIsUploadingScreenshot] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNextStep = () => {
    if (step === 1 && !selectedAddress) {
      alert("Please select or add a delivery address");
      return;
    }
    setStep(step + 1);
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    addAddress(addressForm);
    setSelectedAddress({ ...addressForm, id: Date.now() });
    setIsAddingAddress(false);
    setEditingAddressId(null);
  };

  const handleEditClick = (addr, e) => {
    e.stopPropagation();
    setAddressForm(addr);
    setEditingAddressId(addr.id);
    setIsAddingAddress(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploadingScreenshot(true);
      try {
        const url = await uploadImage(file);
        setPaymentScreenshot(url);
      } catch (err) {
        alert(err.message || 'Failed to upload screenshot');
      } finally {
        setIsUploadingScreenshot(false);
      }
    }
  };

  const handleSubmitOrder = async () => {
    if (!transactionId || transactionId.length < 6) {
      alert("Please enter a valid Transaction ID to confirm your order");
      return;
    }
    if (!paymentScreenshot) {
      alert("Please upload your payment screenshot for verification");
      return;
    }
    setIsSubmitting(true);
    const result = await placeOrder({
      address: selectedAddress,
      transactionId: transactionId,
      paymentScreenshot: paymentScreenshot
    });
    setIsSubmitting(false);
    if (result.success) {
      setStep(3);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(74, 55, 55, 0.4)', backdropFilter: 'blur(10px)' }}
        />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          style={{
            width: '100%',
            maxWidth: '500px',
            background: 'white',
            borderRadius: '40px',
            position: 'relative',
            zIndex: 4001,
            overflow: 'hidden',
            boxShadow: '0 30px 60px rgba(0,0,0,0.15)'
          }}
        >
          {/* Header */}
          <div style={{ padding: '2rem 2rem 1.5rem', background: '#fefafa', borderBottom: '1px solid #fff0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontFamily: 'Roboto', color: 'var(--secondary)' }}>Final Manifest</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 800 }}>Step {step} of 3</p>
            </div>
            <button onClick={onClose} style={{ background: 'white', border: '1px solid #eee', borderRadius: '50%', padding: '0.4rem', color: '#ccc' }}><X size={20} /></button>
          </div>

          <div style={{ padding: '2rem', maxHeight: '70vh', overflowY: 'auto' }}>
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}><MapPin size={18} color="var(--primary)" /> Where should we ship?</h3>
                
                {isAddingAddress ? (
                  <form onSubmit={handleSaveAddress} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#fffcfc', padding: '1.5rem', borderRadius: '25px', border: '1px solid #fff0f0' }}>
                    <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>{editingAddressId ? 'Edit Address' : 'New Address'}</h4>
                    <input type="text" value={addressForm.name} placeholder="Recipient Name" required style={{ width: '100%', padding: '0.8rem 1.2rem', borderRadius: '15px', border: '1px solid #eee', outline: 'none' }} onChange={e => setAddressForm({...addressForm, name: e.target.value})} />
                    <input type="tel" value={addressForm.phone} placeholder="Mobile Number" required style={{ width: '100%', padding: '0.8rem 1.2rem', borderRadius: '15px', border: '1px solid #eee', outline: 'none' }} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} />
                    <textarea value={addressForm.addressText} placeholder="House No, Street, Landmark" required style={{ width: '100%', padding: '0.8rem 1.2rem', borderRadius: '15px', border: '1px solid #eee', outline: 'none', height: '80px' }} onChange={e => setAddressForm({...addressForm, addressText: e.target.value})} />
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <input type="text" value={addressForm.city} placeholder="City" required style={{ flex: 1, padding: '0.8rem 1.2rem', borderRadius: '15px', border: '1px solid #eee', outline: 'none' }} onChange={e => setAddressForm({...addressForm, city: e.target.value})} />
                      <input type="text" value={addressForm.pincode} placeholder="Pincode" required style={{ width: '100px', padding: '0.8rem 1.2rem', borderRadius: '15px', border: '1px solid #eee', outline: 'none' }} onChange={e => setAddressForm({...addressForm, pincode: e.target.value})} />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                      <button type="submit" style={{ flex: 1, padding: '0.8rem', background: 'var(--primary)', color: 'white', borderRadius: '15px', border: 'none', fontWeight: 800 }}>{editingAddressId ? 'Complete Update' : 'Save Address'}</button>
                      <button type="button" onClick={() => { setIsAddingAddress(false); setEditingAddressId(null); }} style={{ padding: '0.8rem 1.5rem', background: 'white', border: '1px solid #eee', borderRadius: '15px', fontWeight: 700 }}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {userAddresses.map(addr => (
                        <div 
                          key={addr.id} 
                          onClick={() => setSelectedAddress(addr)}
                          style={{
                            padding: '1.2rem', 
                            borderRadius: '25px', 
                            background: selectedAddress?.id === addr.id ? '#fff9f9' : 'white',
                            border: selectedAddress?.id === addr.id ? '2px solid var(--primary)' : '1px solid #eee',
                            cursor: 'pointer',
                            position: 'relative',
                            transition: '0.3s'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                              <PinIcon size={16} color={selectedAddress?.id === addr.id ? 'var(--primary)' : '#ccc'} />
                              <p style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--secondary)' }}>{addr.name}</p>
                            </div>
                            <button onClick={(e) => handleEditClick(addr, e)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}><Edit2 size={14} /></button>
                          </div>
                          <p style={{ fontSize: '0.8rem', color: '#666', lineHeight: 1.5, paddingLeft: '1.8rem' }}>{addr.addressText}, {addr.city} - {addr.pincode}</p>
                          <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', paddingLeft: '1.8rem', marginTop: '0.4rem' }}>Mob: {addr.phone}</p>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => { setAddressForm({ name: '', phone: '', addressText: '', city: '', pincode: '' }); setIsAddingAddress(true); }}
                      style={{ padding: '1rem', background: '#fffcfc', border: '2px dashed #eee', borderRadius: '25px', color: 'var(--primary)', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}
                    >
                      <Plus size={18} /> Add New Delivery Address
                    </button>
                  </>
                )}
              </div>
            )}

            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.6rem', justifyContent: 'center' }}><CreditCard size={18} color="var(--primary)" /> Secure Payment</h3>
                
                <div style={{ background: '#fff9f9', padding: '1rem', borderRadius: '20px', border: '1px solid #fff0f0' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 800, lineHeight: 1.5 }}>
                    <AlertCircle size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> 
                    Our payment gateway is currently undergoing maintenance.
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#7a5a5a', marginTop: '0.3rem', lineHeight: 1.4, fontStyle: 'italic' }}>
                    Kindly follow the instructions below to complete your order manifest:
                  </p>
                </div>

                <div style={{ textAlign: 'left', padding: '0 0.5rem' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '1rem' }}>Steps to Manifest:</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700, flexShrink: 0 }}>1</div>
                      <p style={{ fontSize: '0.75rem', color: '#666', lineHeight: 1.4 }}>Scan the QR code below or use the UPI ID to pay the total amount.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700, flexShrink: 0 }}>2</div>
                      <p style={{ fontSize: '0.75rem', color: '#666', lineHeight: 1.4 }}>Take a screenshot of your successful transaction.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700, flexShrink: 0 }}>3</div>
                      <p style={{ fontSize: '0.75rem', color: '#666', lineHeight: 1.4 }}>Enter the Transaction ID below and click 'Complete Submission'.</p>
                    </div>
                  </div>
                </div>
                
                <div style={{ background: '#fff9f9', padding: '1.5rem', borderRadius: '30px', margin: '0.5rem 0', position: 'relative' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '1rem' }}>Scan to Pay ₹{total.toLocaleString()}</p>
                  
                  {siteConfig.upiQR ? (
                    <div style={{ width: '180px', height: '180px', background: 'white', margin: '0 auto', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '4px solid white', boxShadow: '0 10px 25px rgba(233,163,163,0.1)' }}>
                      <img src={siteConfig.upiQR} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="UPI QR" />
                    </div>
                  ) : (
                    <div style={{ width: '180px', height: '180px', background: '#fffcfc', margin: '0 auto', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #eee', padding: '1rem' }}>
                      <AlertCircle size={30} color="var(--primary)" style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                      <p style={{ fontSize: '0.65rem', color: '#999', fontWeight: 600, lineHeight: 1.4 }}>QR Manifest is currently being updated. Please use the UPI ID below or contact support.</p>
                    </div>
                  )}

                  <p style={{ marginTop: '1.2rem', fontWeight: 800, color: 'var(--secondary)', fontSize: '0.85rem' }}>UPI ID: {siteConfig.upiId || 'admin@upi'}</p>
                </div>

                <div style={{ textAlign: 'left' }}>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.8rem', paddingLeft: '0.5rem' }}>Verify Payment Manifest</label>
                  
                  <div style={{ display: 'flex', gap: '1rem', background: '#fffcfc', padding: '1rem', borderRadius: '25px', border: '2px dashed #ffefef', marginBottom: '1.5rem', alignItems: 'center' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '15px', background: 'white', border: '1px solid #f9f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                      {paymentScreenshot ? (
                        <img src={paymentScreenshot} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Screenshot" />
                      ) : (
                        <ImageIcon size={20} color="#eee" />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '0.3rem' }}>{paymentScreenshot ? 'Change Screenshot' : 'Upload Receipt'}</p>
                      <p style={{ fontSize: '0.62rem', color: '#999' }}>Upload the screenshot of your payment</p>
                    </div>
                    <label style={{ 
                      padding: '0.6rem 1rem', 
                      background: 'var(--primary)', 
                      color: 'white', 
                      borderRadius: '12px', 
                      fontSize: '0.7rem', 
                      fontWeight: 800, 
                      cursor: isUploadingScreenshot ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      opacity: isUploadingScreenshot ? 0.7 : 1
                    }}>
                      {isUploadingScreenshot ? 'Uploading...' : (paymentScreenshot ? 'Re-upload' : 'Upload')}
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} disabled={isUploadingScreenshot} />
                    </label>
                  </div>

                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.8rem', paddingLeft: '0.5rem' }}>Transaction ID / UTR Number</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      placeholder="Enter 12-digit UTR or Transaction ID" 
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      style={{ 
                        width: '100%', 
                        padding: '1.2rem 1.5rem', 
                        background: '#fffcfc', 
                        borderRadius: '25px', 
                        border: '2px solid #ffefef', 
                        outline: 'none', 
                        fontSize: '1rem', 
                        fontWeight: 700,
                        color: 'var(--secondary)',
                        transition: '0.3s'
                      }}
                    />
                    <div style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }}>
                      <CreditCard size={20} />
                    </div>
                  </div>
                  <p style={{ fontSize: '0.65rem', color: '#999', marginTop: '1rem', fontStyle: 'italic', padding: '0 0.5rem', lineHeight: 1.5 }}>
                    Note: Your order will be verified using this ID. Please ensure it matches your payment receipt.
                  </p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ background: '#f0fff4', color: '#22c55e', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                  <CheckCircle size={48} />
                </div>
                <h3 style={{ fontSize: '1.8rem', fontFamily: 'Roboto', color: 'var(--secondary)', marginBottom: '1rem' }}>Magic Initiated!</h3>
                <p style={{ color: '#666', lineHeight: 1.6, maxWidth: '300px', margin: '0 auto' }}>Your order is being reviewed by our atelier. Once payment is verified, your designs will be dispatched!</p>
                <button 
                  onClick={onClose}
                  style={{ marginTop: '2.5rem', padding: '1rem 2.5rem', background: 'var(--secondary)', color: 'white', borderRadius: '30px', fontWeight: 800, border: 'none', cursor: 'pointer' }}
                >
                  View My Orders
                </button>
              </div>
            )}
          </div>

          {step < 3 && (
            <div style={{ padding: '1.5rem 2rem 2.5rem', borderTop: '1px solid #f9f0f0', display: 'flex', gap: '1rem' }}>
              {step > 1 && (
                <button 
                  onClick={() => setStep(step - 1)}
                  style={{ padding: '1rem 1.5rem', background: '#f5f5f5', color: '#666', fontWeight: 800, borderRadius: '20px', border: 'none' }}
                >
                  Back
                </button>
              )}
              <button
                onClick={step === 1 ? handleNextStep : handleSubmitOrder}
                disabled={isSubmitting}
                style={{
                  flex: 1, 
                  padding: '1.1rem', 
                  background: 'var(--primary)', 
                  color: 'white', 
                  borderRadius: '20px', 
                  fontWeight: 700, 
                  border: 'none', 
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                {isSubmitting ? 'Verifying...' : (step === 1 ? 'Proceed to Payment' : 'Complete Submission')}
                {step < 2 && <ChevronRight size={18} />}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CheckoutModal;
