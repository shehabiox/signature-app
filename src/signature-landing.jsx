import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, ShoppingBag, ChevronLeft, ChevronRight, MessageCircle, X, Menu, Trash2 } from 'lucide-react';
import './index.css';

// Brand data with the exact custom metallic logo images provided
const BRANDS = [
  { name: 'GUCCI', folder: 'GUCCI_!', count: 20, logo: '/brands/gucci.webp' },
  { name: 'DIOR', folder: 'DIOR_!', count: 7, logo: '/brands/dior.png' },
  { name: 'HERMÈS', folder: 'HERMES_!', count: 7, logo: '/brands/hermes.webp' },
  { name: 'BURBERRY', folder: 'BURBERRY_!', count: 5, logo: '/brands/burberry.png' },
  { name: 'LOUIS VUITTON', folder: 'LOUIS VUITTON_!', count: 5, logo: '/brands/louis_vuitton.webp' },
  { name: 'CHANEL', folder: 'CHANEL_!', count: 1, logo: '/brands/chanel.png' },
  { name: 'FERRAGAMO', folder: 'Salvatore Ferragamo_!', count: 2, logo: '/brands/ferragamo.webp' },
  { name: 'GIVENCHY', folder: 'GIVENCHY_!', count: 1, logo: '/brands/givenchy.webp' },
];

// Shopify Storefront API client helper
const domain = import.meta.env.VITE_SHOPIFY_DOMAIN || 'signature-r9nzewjm.myshopify.com';
const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || 'd541ded103732d88741b8fe0a15e7152';

async function shopifyFetch(query, variables = {}) {
  try {
    const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables }),
    });
    const json = await response.json();
    if (json.errors) {
      console.error('Shopify API errors:', json.errors);
    }
    return json.data;
  } catch (error) {
    console.error('Error fetching from Shopify:', error);
    return null;
  }
}

// Marquee Component
const Marquee = ({ text, speed = 40 }) => {
  return (
    <div className="overflow-hidden bg-[#0a0a0a] border-b border-white/10 py-2.5">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
        className="flex whitespace-nowrap will-change-transform"
        style={{ transform: 'translateZ(0)' }}
      >
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center">
            {text.split('•').map((item, idx) => (
              <span key={idx} className="text-xs uppercase tracking-[0.25em] text-[#C5A880] mx-6 flex items-center font-sans font-medium">
                {item.trim()}
                <span className="ml-6 text-white/30">•</span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// Announcement Bar
const AnnouncementBar = () => {
  const marqueeText = 'Premium Jacquard • Elegance Simplified • Build Your Signature Bundle & Save';
  return <Marquee text={marqueeText} speed={35} />;
};

// Header Component
const Header = ({ cart, setCartOpen, searchOpen, setSearchOpen, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleItemClick = (e, item) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigate(item);
  };

  return (
    <>
      <header className="bg-[#050505]/95 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white/80 hover:text-white transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <div className="hidden md:flex items-center gap-2 text-xs text-[#C5A880] tracking-widest uppercase">
              {/* Removed location indicator */}
            </div>

            <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
              <a href="#" className="inline-block group">
                <h1 className="text-2xl md:text-3xl font-light tracking-[0.3em] text-white group-hover:text-[#C5A880] transition-colors" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  SIGNATURE
                </h1>
                <p className="text-[9px] tracking-[0.4em] text-white/40 uppercase mt-0.5">Maison de Cravates</p>
              </a>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-white/80 hover:text-white hover:bg-white/5 rounded-full transition"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
              <button
                onClick={() => setCartOpen(true)}
                className="p-2 text-white/80 hover:text-white hover:bg-white/5 rounded-full transition relative"
                aria-label="Cart"
              >
                <ShoppingBag size={18} />
                {totalQuantity > 0 && (
                  <span className="absolute top-1 right-1 bg-[#C5A880] text-black font-semibold text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {totalQuantity}
                  </span>
                )}
              </button>
            </div>
          </div>

          <nav className="hidden md:flex justify-center items-center gap-10 mt-6 pt-4 border-t border-white/5">
            {['Home', 'Shop', 'The Journal', 'Contact', 'The Signature World'].map((item, idx) => (
              <a
                key={idx}
                href="#"
                onClick={(e) => handleItemClick(e, item)}
                className="text-xs uppercase tracking-[0.2em] text-white/70 hover:text-[#C5A880] transition-colors relative py-1 group"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#C5A880] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col pt-6 px-6 md:hidden"
          >
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-xl tracking-[0.2em] text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>SIGNATURE</h2>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-white/80">
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col gap-6 text-lg">
              {['Home', 'Shop', 'The Journal', 'Contact', 'The Signature World'].map((item) => (
                <a
                  key={item}
                  href="#"
                  onClick={(e) => handleItemClick(e, item)}
                  className="text-white/80 hover:text-[#C5A880] tracking-widest font-light transition"
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const CartDrawer = ({ cartOpen, setCartOpen, cart, removeFromCart, updateQuantity }) => {
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart' or 'details'
  const [email, setEmail] = useState('');
  const [emailOffers, setEmailOffers] = useState(true);
  const [country, setCountry] = useState('Egypt');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [governorate, setGovernorate] = useState('Cairo');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [saveInfo, setSaveInfo] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [billingSame, setBillingSame] = useState(true);

  const subtotal = cart.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0);
  const shippingCost = shippingMethod === 'standard' ? 100.00 : 0.00;
  const grandTotal = subtotal + shippingCost;

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !phone || !address) {
      alert('Please fill in your name, phone, and delivery address.');
      return;
    }

    // Send order details via WhatsApp to the owner (201130503073)
    const itemsList = cart.map(i => `- ${i.title} (x${i.quantity}) - ${i.currency} ${i.price}`).join('\n');
    const msg = encodeURIComponent(
      `🛍️ NEW MAISON SIGNATURE ORDER!\n\n` +
      `👤 Customer: ${firstName} ${lastName}\n` +
      `📞 Phone: ${phone}\n` +
      `📧 Email: ${email || 'N/A'}\n` +
      `📍 Address: ${address}${apartment ? `, ${apartment}` : ''}\n` +
      `🏙️ City / Governorate: ${city || ''} ${governorate}\n` +
      `📦 Shipping: ${shippingMethod === 'standard' ? 'Standard (100 LE)' : 'Free'}\n` +
      `💳 Payment: ${paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Online Payment'}\n\n` +
      `🛒 ITEMS:\n${itemsList}\n\n` +
      `💰 Grand Total: LE ${grandTotal.toFixed(2)}`
    );
    window.open(`https://wa.me/201130503073?text=${msg}`, '_blank');

    // Proceed directly to Shopify secure checkout
    handleShopifyCheckout();
  };

  const handleShopifyCheckout = async () => {
    if (cart.length === 0) return;
    const mutation = `
      mutation cartCreate($lineItems: [CartLineInput!]) {
        cartCreate(input: { lines: $lineItems }) {
          cart {
            id
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const lineItems = cart.map(item => ({
      merchandiseId: item.variantId,
      quantity: item.quantity
    }));

    const data = await shopifyFetch(mutation, { lineItems });
    const checkoutUrl = data?.cartCreate?.cart?.checkoutUrl;

    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end"
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full max-w-lg bg-[#111111] h-full border-l border-white/10 flex flex-col p-6 overflow-y-auto"
          >
            <div className="flex justify-between items-center pb-6 border-b border-white/10">
              <h3 className="text-lg text-white tracking-widest" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {checkoutStep === 'cart' ? `YOUR CART (${cart.reduce((a, c) => a + c.quantity, 0)})` : 'SECURE CHECKOUT'}
              </h3>
              <button onClick={() => { setCartOpen(false); setCheckoutStep('cart'); }} className="text-white/60 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {checkoutStep === 'cart' ? (
              <>
                <div className="flex-1 py-6 space-y-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-20 text-white/40 text-sm tracking-wide">
                      Your cart is currently empty.
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="flex gap-4 items-center bg-white/5 p-4 rounded-lg border border-white/5">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="text-sm text-white font-medium">{item.title}</h4>
                          <p className="text-xs text-[#C5A880] mt-1">{item.currency} {item.price}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="text-white/60 hover:text-white px-2 bg-white/10 rounded text-xs"
                            >
                              -
                            </button>
                            <span className="text-xs text-white">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="text-white/60 hover:text-white px-2 bg-white/10 rounded text-xs"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-white/40 hover:text-red-400 p-2 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="pt-6 border-t border-white/10">
                    <div className="flex justify-between text-white mb-4">
                      <span className="text-sm tracking-wider">Subtotal</span>
                      <span className="text-lg font-light text-[#C5A880]">LE {subtotal.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => setCheckoutStep('details')}
                      className="w-full py-4 bg-[#C5A880] text-black font-semibold tracking-[0.2em] uppercase text-xs hover:bg-[#b3976f] transition rounded shadow-xl"
                    >
                      Proceed to Secure Checkout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="flex-1 py-6 space-y-6 text-xs">
                {/* 1. Contact Information */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-white font-medium uppercase tracking-widest text-[11px]">Contact Information</h4>
                    <span className="text-white/40 text-[10px]">Already have an account? Log in</span>
                  </div>
                  <div>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email address"
                        className="w-full bg-[#181818] border border-white/20 rounded p-3 text-white text-xs focus:border-[#C5A880] outline-none pr-10"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 cursor-pointer" title="We will send your order confirmation here">?</span>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-white/70 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={emailOffers}
                      onChange={(e) => setEmailOffers(e.target.checked)}
                      className="accent-[#C5A880] rounded"
                    />
                    <span>Email me with news and offers</span>
                  </label>
                </div>

                {/* 2. Delivery Section */}
                <div className="space-y-3">
                  <h4 className="text-white font-medium uppercase tracking-widest text-[11px]">Delivery</h4>
                  <div>
                    <label className="block text-white/50 mb-1">Country/Region</label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-[#181818] border border-white/20 rounded p-3 text-white text-xs focus:border-[#C5A880] outline-none"
                    >
                      <option value="Egypt">Egypt</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="Saudi Arabia">Saudi Arabia</option>
                      <option value="United States">United States</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First name"
                        className="w-full bg-[#181818] border border-white/20 rounded p-3 text-white text-xs focus:border-[#C5A880] outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last name"
                        className="w-full bg-[#181818] border border-white/20 rounded p-3 text-white text-xs focus:border-[#C5A880] outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Address"
                      className="w-full bg-[#181818] border border-white/20 rounded p-3 text-white text-xs focus:border-[#C5A880] outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                      placeholder="Apartment, suite, etc. (optional)"
                      className="w-full bg-[#181818] border border-white/20 rounded p-3 text-white text-xs focus:border-[#C5A880] outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                        className="w-full bg-[#181818] border border-white/20 rounded p-3 text-white text-xs focus:border-[#C5A880] outline-none"
                      />
                    </div>
                    <div>
                      <select
                        value={governorate}
                        onChange={(e) => setGovernorate(e.target.value)}
                        className="w-full bg-[#181818] border border-white/20 rounded p-3 text-white text-xs focus:border-[#C5A880] outline-none"
                      >
                        <option value="Cairo">Cairo</option>
                        <option value="Giza">Giza</option>
                        <option value="Alexandria">Alexandria</option>
                        <option value="Dakahlia">Dakahlia</option>
                        <option value="Red Sea">Red Sea</option>
                        <option value="Beheira">Beheira</option>
                        <option value="Faiyum">Faiyum</option>
                        <option value="Gharbia">Gharbia</option>
                        <option value="Ismailia">Ismailia</option>
                        <option value="Aswan">Aswan</option>
                        <option value="Assiut">Assiut</option>
                        <option value="Luxor">Luxor</option>
                        <option value="New Valley">New Valley</option>
                        <option value="Marsa Matrouh">Marsa Matrouh</option>
                        <option value="Port Said">Port Said</option>
                        <option value="Suez">Suez</option>
                        <option value="Menofia">Menofia</option>
                        <option value="Qalyubia">Qalyubia</option>
                        <option value="Sharqia">Sharqia</option>
                        <option value="Kafr El-Sheikh">Kafr El-Sheikh</option>
                        <option value="Damietta">Damietta</option>
                        <option value="Beni Suef">Beni Suef</option>
                        <option value="Minya">Minya</option>
                        <option value="Sohag">Sohag</option>
                        <option value="Qena">Qena</option>
                        <option value="South Sinai">South Sinai</option>
                        <option value="North Sinai">North Sinai</option>
                      </select>
                    </div>
                    <div>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="Postal code (opt.)"
                        className="w-full bg-[#181818] border border-white/20 rounded p-3 text-white text-xs focus:border-[#C5A880] outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone"
                        className="w-full bg-[#181818] border border-white/20 rounded p-3 text-white text-xs focus:border-[#C5A880] outline-none pr-10"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 cursor-pointer" title="Required for delivery updates">?</span>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-white/70 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={saveInfo}
                      onChange={(e) => setSaveInfo(e.target.checked)}
                      className="accent-[#C5A880] rounded"
                    />
                    <span>Save this information for next time</span>
                  </label>
                </div>

                {/* 3. Shipping Method Section */}
                <div className="space-y-3">
                  <h4 className="text-white font-medium uppercase tracking-widest text-[11px]">Shipping Method</h4>
                  <div className="bg-[#181818] border border-[#C5A880]/50 rounded p-3 flex justify-between items-center">
                    <label className="flex items-center gap-3 text-white cursor-pointer">
                      <input type="radio" checked readOnly className="accent-[#C5A880]" />
                      <span>Standard Courier Delivery</span>
                    </label>
                    <span className="text-[#C5A880] font-medium">LE 100.00</span>
                  </div>
                </div>

                {/* 4. Payment Section */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-white font-medium uppercase tracking-widest text-[11px]">Payment</h4>
                    <span className="text-white/40 text-[10px]">🔒 All transactions are secure and encrypted.</span>
                  </div>
                  <div className="bg-[#181818] border border-[#C5A880]/50 rounded p-3 flex items-center justify-between">
                    <label className="flex items-center gap-3 text-white cursor-pointer">
                      <input type="radio" checked readOnly className="accent-[#C5A880]" />
                      <span>Cash on Delivery (COD)</span>
                    </label>
                    <span className="text-white/40 text-[10px]">Pay upon delivery</span>
                  </div>
                </div>

                {/* 5. Billing Address Section */}
                <div className="space-y-3">
                  <h4 className="text-white font-medium uppercase tracking-widest text-[11px]">Billing Address</h4>
                  <div className="bg-[#181818] border border-white/20 rounded p-3">
                    <label className="flex items-center gap-3 text-white cursor-pointer">
                      <input
                        type="radio"
                        checked={billingSame}
                        onChange={() => setBillingSame(true)}
                        className="accent-[#C5A880]"
                      />
                      <span>Same as shipping address</span>
                    </label>
                  </div>
                </div>

                {/* Summary & Submit */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="flex justify-between text-white/70">
                    <span>Subtotal</span>
                    <span>LE {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Shipping</span>
                    <span>LE {shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white text-sm font-semibold pt-2 border-t border-white/10">
                    <span>Total</span>
                    <span className="text-[#C5A880]">LE {grandTotal.toFixed(2)}</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#C5A880] text-black font-semibold tracking-[0.2em] uppercase text-xs hover:bg-[#b3976f] transition rounded shadow-2xl mt-4"
                  >
                    Complete Order
                  </button>
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('cart')}
                    className="w-full py-2 text-white/50 hover:text-white text-xs tracking-widest uppercase transition"
                  >
                    Return to Cart
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hero Section
const HeroSection = () => {
  return (
    <section className="relative w-full h-[92vh] flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
      >
        <source src="/hero-video.mov" type="video/quicktime" />
        <source src="/hero-video.mov" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#050505] z-1" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-10"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-xs md:text-sm text-[#C5A880] tracking-[0.4em] uppercase mb-4 font-medium"
        >
          MAISON SIGNATURE — EST. 2026
        </motion.p>

        <h2
          className="text-5xl sm:text-7xl md:text-8xl text-white mb-6 tracking-tight leading-none"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
        >
          The Tie, Reimagined.
        </h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-6"
        >
          <p
            className="text-2xl md:text-3xl text-[#C5A880]/90 italic font-light tracking-wide"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Where absolute elegance meets effortless intention
          </p>
        </motion.div>

        <p className="text-sm md:text-base text-white/60 mb-12 tracking-[0.25em] uppercase font-light">
          Elegance, simplified.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <motion.a
            href="#brands"
            whileHover={{ scale: 1.03, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/30 bg-white/5 backdrop-blur-md text-white text-xs tracking-[0.2em] uppercase font-medium transition-all shadow-xl"
          >
            SHOP BY BRAND
          </motion.a>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-12 z-20 will-change-transform"
      >
        <a
          href="#brands"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black/80 border border-[#C5A880]/40 text-white text-xs tracking-[0.2em] uppercase hover:bg-black hover:border-[#C5A880] transition-all shadow-2xl backdrop-blur-md"
        >
          <span>✨ Luxury Designer Ties</span>
        </a>
      </motion.div>
    </section>
  );
};

// Brand Filter Section
const BrandFilterSection = ({ selectedBrand, onBrandSelect }) => {
  return (
    <section id="brands" className="bg-[#0a0a0a] py-20 px-6 border-y border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-[#C5A880] mb-3 font-medium">CURATED LUXURY</p>
          <h2
            className="text-4xl md:text-5xl text-white mb-4 tracking-wide"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
          >
            SHOP BY BRAND
          </h2>
          <p className="text-white/50 text-sm tracking-wide">Timeless elegance from the world's most prestigious Maisons</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {BRANDS.map((brand) => {
            const isSelected = selectedBrand?.name === brand.name;
            return (
              <motion.button
                key={brand.name}
                onClick={() => onBrandSelect(brand)}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className={`group relative aspect-[4/3] backdrop-blur-md border rounded transition-all overflow-hidden p-0 flex flex-col items-center justify-center ${
                  isSelected ? 'border-[#C5A880] ring-2 ring-[#C5A880]/50 shadow-2xl' : 'border-white/10 hover:border-[#C5A880]/50'
                }`}
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  loading="eager"
                  fetchPriority="high"
                  className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                <div className="relative z-20 flex items-center justify-center pb-3 w-full mt-auto">
                  <span className="text-[#C5A880] text-xs font-medium tracking-[0.2em] uppercase bg-black/60 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                    {brand.count} {brand.count === 1 ? 'Piece' : 'Pieces'}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const ProductQuickView = ({ product, isOpen, onClose, addToCart }) => {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [hasBox, setHasBox] = useState(false); // No Box as default

  if (!isOpen || !product) return null;

  const images = product.colors
    ? product.colors.map(c => c.image)
    : (product.images || [product.image]);

  const activeImage = product.colors
    ? product.colors[selectedColorIndex].image
    : images[activeImgIndex] || product.image;

  const activeColorName = product.colors ? product.colors[selectedColorIndex].name : '';
  const basePrice = parseFloat(product.price);
  const boxPriceVal = product.boxPrice ? parseFloat(product.boxPrice) : (basePrice + 200.00);
  const unitPrice = hasBox ? boxPriceVal : basePrice;

  const handleAddToCart = () => {
    addToCart({
      ...product,
      image: activeImage,
      title: activeColorName
        ? `${product.title} (${activeColorName})${hasBox ? ' [With Luxury Box]' : ' [No Box]'}`
        : `${product.title}${hasBox ? ' [With Luxury Box]' : ' [No Box]'}`,
      price: unitPrice.toFixed(2),
      quantity: quantity
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden max-w-4xl w-full my-auto max-h-[90vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 shadow-2xl relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 text-white/60 hover:text-white bg-black/40 hover:bg-black p-2 rounded-full transition"
          >
            <X size={20} />
          </button>

          {/* Image gallery side */}
          <div className="relative aspect-[4/5] bg-black/40 flex items-center justify-center overflow-hidden">
            <img
              key={activeImage}
              src={activeImage}
              alt={product.title}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover"
            />
            {images.length > 1 && !product.colors && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`w-12 h-12 rounded overflow-hidden border transition-all ${idx === activeImgIndex ? 'border-[#C5A880] scale-105 ring-1 ring-[#C5A880]' : 'border-white/20 opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product details side */}
          <div className="p-8 md:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-[0.3em] text-[#C5A880] font-medium">
                  {product.brand || 'MAISON SIGNATURE'}
                </span>
                <span className="text-[10px] uppercase tracking-widest bg-[#C5A880]/10 text-[#C5A880] border border-[#C5A880]/30 px-2.5 py-0.5 rounded-full">
                  Handcrafted Luxury
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl text-white font-light tracking-wide mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {product.title}
              </h2>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-xl text-[#C5A880] font-semibold">{product.currency} {unitPrice.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-white/40 text-sm line-through">{product.currency} {product.originalPrice}</span>
                )}
              </div>

              <p className="text-white/60 text-xs md:text-sm leading-relaxed mb-6">
                Exquisitely woven from 100% pure jacquard silk. Designed for the discerning gentleman seeking absolute elegance, pristine drape, and timeless sophistication.
              </p>

              {/* Packaging Options: With Box vs No Box (Default) */}
              <div className="mb-6">
                <label className="block text-xs uppercase tracking-[0.2em] text-white/70 mb-2">
                  Packaging <span className="text-[#C5A880] font-medium">(No Box as Default)</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setHasBox(false)}
                    className={`py-3 px-4 rounded border text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                      !hasBox
                        ? 'border-[#C5A880] bg-[#C5A880]/10 text-white font-semibold ring-1 ring-[#C5A880]'
                        : 'border-white/10 bg-white/5 text-white/70 hover:border-white/30'
                    }`}
                  >
                    <span>No Box (Default)</span>
                  </button>
                  <button
                    onClick={() => setHasBox(true)}
                    className={`py-3 px-4 rounded border text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                      hasBox
                        ? 'border-[#C5A880] bg-[#C5A880]/10 text-white font-semibold ring-1 ring-[#C5A880]'
                        : 'border-white/10 bg-white/5 text-white/70 hover:border-white/30'
                    }`}
                  >
                    <span>With Gift Box (LE {boxPriceVal.toFixed(2)})</span>
                  </button>
                </div>
              </div>

              {product.colors && product.colors.length > 1 && (
                <div className="mb-6">
                  <label className="block text-xs uppercase tracking-[0.2em] text-white/70 mb-2">
                    Color Variant: <span className="text-[#C5A880] font-medium">{activeColorName}</span>
                  </label>
                  <div className="flex gap-3">
                    {product.colors.map((col, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedColorIndex(idx)}
                        className={`flex items-center gap-2 px-3 py-2 rounded border text-xs tracking-wider transition-all ${idx === selectedColorIndex ? 'border-[#C5A880] bg-[#C5A880]/10 text-white' : 'border-white/10 bg-white/5 text-white/70 hover:border-white/30'}`}
                      >
                        <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: col.hex }} />
                        {col.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2 mb-8 text-xs text-white/70 border-t border-b border-white/10 py-4">
                {product.specifications ? (
                  Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="flex justify-between"><span>{key}:</span> <span className="text-white font-medium">{val}</span></div>
                  ))
                ) : (
                  <>
                    <div className="flex justify-between"><span>Material:</span> <span className="text-white font-medium">100% Pure Jacquard Silk</span></div>
                    <div className="flex justify-between"><span>Width:</span> <span className="text-white font-medium">7.5 CM</span></div>
                    <div className="flex justify-between"><span>Length:</span> <span className="text-white font-medium">147 CM</span></div>
                  </>
                )}
                <div className="flex justify-between"><span>Packaging:</span> <span className="text-white font-medium">{hasBox ? 'With Luxury Gift Box' : 'Without Box (Default)'}</span></div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-white/20 rounded bg-white/5">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2.5 text-white/70 hover:text-white">-</button>
                  <span className="px-4 text-sm text-white font-medium">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2.5 text-white/70 hover:text-white">+</button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-4 bg-[#C5A880] text-black font-semibold tracking-[0.2em] uppercase text-xs hover:bg-[#b3976f] transition shadow-xl rounded"
                >
                  Add to Secure Cart — {product.currency} {(unitPrice * quantity).toFixed(2)}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ProductItem = ({ product, addToCart, onQuickView, index }) => {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const activeImage = product.colors
    ? product.colors[selectedColorIndex].image
    : (product.images && product.images.length > 0 ? product.images[currentImgIndex] : product.image);

  const activeColorName = product.colors ? product.colors[selectedColorIndex].name : '';

  const nextImage = (e) => {
    e.stopPropagation();
    if (product.images && product.images.length > 1) {
      setCurrentImgIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (product.images && product.images.length > 1) {
      setCurrentImgIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const nextColor = (e) => {
    e.stopPropagation();
    if (product.colors && product.colors.length > 1) {
      setSelectedColorIndex((prev) => (prev + 1) % product.colors.length);
    }
  };

  const prevColor = (e) => {
    e.stopPropagation();
    if (product.colors && product.colors.length > 1) {
      setSelectedColorIndex((prev) => (prev - 1 + product.colors.length) % product.colors.length);
    }
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      className="flex-shrink-0 w-72 md:w-80 group cursor-pointer snap-start transition-transform duration-300 hover:-translate-y-1.5 will-change-transform"
      style={{ backfaceVisibility: 'hidden', perspective: 1000, transform: 'translate3d(0,0,0)' }}
    >
      <div className="relative aspect-[4/5] mb-4 overflow-hidden rounded bg-[#161616]" style={{ willChange: 'transform', transform: 'translate3d(0,0,0)' }}>
        <img
          key={activeImage}
          src={activeImage}
          alt={product.title}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          width="320"
          height="400"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 bg-[#1a1a1a]"
        />

        {product.images && product.images.length > 1 && !product.colors && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-lg"
              aria-label="Previous angle"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-lg"
              aria-label="Next angle"
            >
              <ChevronRight size={16} />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
              {product.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setCurrentImgIndex(idx); }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImgIndex ? 'bg-[#C5A880] w-3' : 'bg-white/50'}`}
                  aria-label={`Go to angle ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {product.colors && product.colors.length > 1 && (
          <>
            <button
              onClick={prevColor}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-lg"
              aria-label="Previous color"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextColor}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-lg"
              aria-label="Next color"
            >
              <ChevronRight size={16} />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">
              <span className="text-[10px] text-[#C5A880] uppercase tracking-wider">{activeColorName}</span>
            </div>
          </>
        )}

        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6 z-10 pointer-events-none">
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart({ ...product, image: activeImage, title: activeColorName ? `${product.title} (${activeColorName})` : product.title });
            }}
            className="w-full py-3 bg-white text-black text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#C5A880] transition-colors pointer-events-auto shadow-xl"
          >
            Add to Cart
          </button>
        </div>
      </div>

      <h3 className="text-sm text-white/90 font-light tracking-wide mb-1 group-hover:text-[#C5A880] transition-colors">
        {product.title}
      </h3>

      {product.colors && product.colors.length > 1 && (
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] text-white/50 uppercase tracking-widest">Color: {activeColorName}</span>
          <div className="flex gap-1.5 ml-auto">
            {product.colors.map((col, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setSelectedColorIndex(idx); }}
                className={`w-4 h-4 rounded-full border transition-all ${idx === selectedColorIndex ? 'border-[#C5A880] scale-110 ring-1 ring-[#C5A880]' : 'border-white/20 hover:border-white'}`}
                style={{ backgroundColor: col.hex }}
                title={col.name}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 items-center mt-2">
        <span className="text-white font-medium text-sm">{product.currency} {product.price}</span>
        {product.originalPrice && (
          <span className="text-white/40 text-xs line-through">{product.currency} {product.originalPrice}</span>
        )}
      </div>
    </div>
  );
};

// Shop By Collection Section (Dynamic Brand Products)
const ShopByCollection = ({ selectedBrand, addToCart, onQuickView }) => {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    async function loadBrandProducts() {
      setLoading(true);
      if (!selectedBrand) return;
      if (containerRef.current) {
        containerRef.current.scrollLeft = 0;
      }

      try {
        const res = await fetch('/products.json');
        const allProducts = await res.json();

        let brandKey = selectedBrand.name;
        if (brandKey === 'FERRAGAMO') brandKey = 'Salvatore Ferragamo';

        const normalizeStr = (str) => (str || '').normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

        const filtered = allProducts.filter(p => normalizeStr(p.brand) === normalizeStr(brandKey));
        setProducts(filtered);
        containerRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
      } catch (error) {
        console.error('Error loading products.json:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    loadBrandProducts();
  }, [selectedBrand]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollBy({
          left: e.deltaY,
          behavior: 'auto',
        });
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
    };
  }, [loading, selectedBrand]);

  const scroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = 344;
      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleWheel = (e) => {
    if (containerRef.current && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      containerRef.current.scrollBy({
        left: e.deltaY,
        behavior: 'auto',
      });
    }
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
      setScrollProgress(isNaN(progress) ? 0 : progress);
    }
  };

  if (!selectedBrand) return null;

  return (
    <section id="collection" className="bg-[#050505] py-28 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-[#C5A880] mb-3 font-medium">CURATED COLLECTION</p>
          <h2
            className="text-4xl md:text-5xl text-white mb-4 tracking-wide"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
          >
            {selectedBrand.name} TIES ({selectedBrand.count})
          </h2>
          <p className="text-white/50 text-sm tracking-wide">Handcrafted jacquard silk with immaculate finish</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-white/50 tracking-widest text-sm">Loading collection...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/60 text-sm tracking-widest uppercase mb-2">Exclusive Collection</p>
            <h3 className="text-2xl text-[#C5A880] font-light tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              New curated masterpieces arriving soon.
            </h3>
          </div>
        ) : (
          <div className="relative px-4 sm:px-12">
            {/* Left Scroll Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scroll('left')}
              className="absolute left-0 top-[45%] -translate-y-1/2 z-20 p-3.5 bg-[#111111]/90 hover:bg-[#111111] text-[#C5A880] rounded-full transition-all border border-[#C5A880]/40 shadow-[0_4px_20px_rgba(0,0,0,0.8)] backdrop-blur-md"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </motion.button>

            {/* Right Scroll Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scroll('right')}
              className="absolute right-0 top-[45%] -translate-y-1/2 z-20 p-3.5 bg-[#111111]/90 hover:bg-[#111111] text-[#C5A880] rounded-full transition-all border border-[#C5A880]/40 shadow-[0_4px_20px_rgba(0,0,0,0.8)] backdrop-blur-md"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </motion.button>

            <div
              ref={containerRef}
              onScroll={handleScroll}
              onWheel={handleWheel}
              className="flex gap-6 overflow-x-auto scrollbar-none pb-6 snap-x snap-loose will-change-transform"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                transform: 'translate3d(0,0,0)',
                backfaceVisibility: 'hidden',
                perspective: 1000
              }}
            >
              {products.map((product, idx) => (
                <ProductItem key={product.id} product={product} addToCart={addToCart} onQuickView={onQuickView} index={idx} />
              ))}
            </div>

            <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/10 px-2">
              <div className="hidden sm:block flex-1 mr-12 h-[2px] bg-white/10 relative overflow-hidden">
                <motion.div
                  className="h-full bg-[#C5A880]"
                  style={{ width: `${scrollProgress}%` }}
                />
              </div>

              <span className="text-white/40 text-xs tracking-[0.2em] uppercase mx-auto sm:mx-0">EXPLORE</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// Find Your Perfect Tie Component with 1 Button and Modal for exact 16 ties from C:\Users\Elmasrypc\Desktop\matching\matching ties
const FindYourPerfectTie = ({ addToCart, onQuickView }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTieIndex, setSelectedTieIndex] = useState(0);
  const [activeMatchingIndex, setActiveMatchingIndex] = useState(0);

  // Preload all matching suit images and tie images for instant rendering on mobile & desktop
  useEffect(() => {
    matchingTies.forEach(tie => {
      const tieImg = new Image();
      tieImg.src = tie.tieImage;
      tie.matchingLooks.forEach(look => {
        const img = new Image();
        img.src = look.image;
      });
    });
  }, []);

  // Reset active matching index when selected tie changes
  useEffect(() => {
    setActiveMatchingIndex(0);
  }, [selectedTieIndex]);

  const matchingTies = [
    {
      name: "DIOR - Striped CD Icon Silk Tie",
      tieImage: "/products/DIOR/01-striped-cd-icon-silk-tie/DIOR%20-%20STRIPED%20CD%20ICON%20SILK%20TIE.jpg",
      matchingLooks: [
        { label: "Charcoal Suit", image: "/matching/8b571844-2e70-49aa-8228-e7d0679616af.jpg" },
        { label: "Navy Tailored", image: "/matching/74dab8e0-0109-4480-a7dc-2755d9107bd0.jpg" },
        { label: "Classic Elegance", image: "/matching/30319d81-b813-4b22-85b5-08181ac54ca3.jpg" }
      ],
      title: "DIOR - Striped CD Icon Silk Tie",
      price: "1400.00",
      currency: "LE"
    },
    {
      name: "GUCCI - Navy and Green GG Silk Jacquard",
      tieImage: "/products/GUCCI/01-navy-green-gg-silk-jacquard-tie/GUCCI%20-%20Navy%20and%20Green%20GG%20SILKJACQUARD%20TIE.jpg",
      matchingLooks: [
        { label: "Navy Tailored", image: "/matching/e475c486-ddd4-4f46-923a-4d664a5b45b3.jpg" },
        { label: "Forest Green", image: "/matching/814b03c4-9503-4f33-9a3b-2d0b73021f56.jpg" },
        { label: "Classic Navy", image: "/matching/watermarked_img_11387676837491808454.jpg" }
      ],
      title: "GUCCI - Navy and Green GG Silk Jacquard Tie",
      price: "1400.00",
      currency: "LE"
    },
    {
      name: "GUCCI - Navy Bee Stripped Silk Tie",
      tieImage: "/products/GUCCI/18-navy-bee-stripped-silk-tie/GUCCI%20-%20Navy%20BEE%20STRIPPED%20SILK%20TIE.jpg",
      matchingLooks: [
        { label: "Atelier View 1", image: "/matching/gucci-navy-bee-1.jpg" },
        { label: "Atelier View 2", image: "/matching/gucci-navy-bee-2.jpg" },
        { label: "Atelier View 3", image: "/matching/gucci-navy-bee-3.jpg" },
        { label: "Atelier View 4", image: "/matching/gucci-navy-bee-4.jpg" }
      ],
      title: "GUCCI - Navy Bee Stripped Silk Tie",
      price: "1400.00",
      currency: "LE"
    },
    {
      name: "GUCCI - Black GG Jacquard Pattern",
      tieImage: "/products/GUCCI/03-black-gg-jacquard-pattern/GUCCI%20-%20Black%20GG%20JACQUARD%20PATTERN.jpg",
      matchingLooks: [
        { label: "Black Look 1", image: "/matching/gucci-black-gg-1.jpg" },
        { label: "Black Look 2", image: "/matching/gucci-black-gg-2.jpg" },
        { label: "Black Look 3", image: "/matching/gucci-black-gg-3.jpg" },
        { label: "Black Look 4", image: "/matching/gucci-black-gg-4.jpg" }
      ],
      title: "GUCCI - Black GG Jacquard Pattern Tie",
      price: "1400.00",
      currency: "LE"
    },
    {
      name: "GUCCI - Dark Red GG Pattern Check Silk",
      tieImage: "/products/GUCCI/06-dark-red-gg-pattern-check-silk/GUCCI%20-%20Dark%20Red%20GG%20PATTERN%20CHECK%20SILK.jpg",
      matchingLooks: [
        { label: "Burgundy Accent", image: "/matching/bc650dc0-9722-406b-82da-4554df6d6611.jpg" },
        { label: "Charcoal Suit", image: "/matching/83156078-4e16-44ca-8ee4-a4c9df0513ff.jpg" },
        { label: "Midnight Suit", image: "/matching/d6c1826b-3e23-4006-8883-4d51fc8831ce.jpg" }
      ],
      title: "GUCCI - Dark Red GG Pattern Check Silk Tie",
      price: "1400.00",
      currency: "LE"
    },
    {
      name: "BURBERRY - BT Lined Silk Tie",
      tieImage: "/products/BURBERRY/01-bt-lined-silk-tie/BURBERRY%20-%20BT%20LINED%20SILK%20TIE.jpg",
      matchingLooks: [
        { label: "Burberry Look 1", image: "/matching/burberry-1.jpg" },
        { label: "Burberry Look 2", image: "/matching/burberry-2.jpg" },
        { label: "Burberry Look 3", image: "/matching/burberry-3.jpg" },
        { label: "Burberry Look 4", image: "/matching/burberry-4.jpg" }
      ],
      title: "BURBERRY - BT Lined Silk Tie",
      price: "1400.00",
      currency: "LE"
    },
    {
      name: "Salvatore Ferragamo Silk Tie",
      tieImage: "/products/Salvatore%20Ferragamo/01-aqua-green-small-pattern-silk-tie/Ferragamo%20-%20Aqua%20Green%20small%20pattern%20Silk%20Tie.jpg",
      matchingLooks: [
        { label: "Teal Accent", image: "/matching/Sophisticated%20Teal%20Tie%20Portrait.png" },
        { label: "Aqua Formal", image: "/matching/Confident%20Teal-Tie%20Portrait.png" },
        { label: "Modern Suit", image: "/matching/dd2e385e-e196-41a3-bb14-dc4693c7029a.png" }
      ],
      title: "Salvatore Ferragamo - Small Pattern Silk Tie (Aqua Green)",
      price: "1600.00",
      currency: "LE"
    },
    {
      name: "Givenchy - Maroon Solid Classic Silk Tie",
      tieImage: "/products/GIVENCHY/01-maroon-solid-classic-silk-tie/Givenchy%20-%20Maroon%20Solid%20Classic%20Silk%20Tie.jpg",
      matchingLooks: [
        { label: "Maroon Silk", image: "/matching/7e3773eb-8070-4f97-9803-b37a2720f3e1.jpg" },
        { label: "Evening Suit", image: "/matching/5f593cb6-4ec4-4ab5-b84e-d02ba0c0f980.jpg" },
        { label: "Burgundy Look", image: "/matching/2c061128-8fb0-401d-9a90-f8a635e0c633.jpg" },
        { label: "Signature Look", image: "/matching/e1a5e31b-849b-44dc-92e6-fe0931efa79b.jpg" }
      ],
      title: "GIVENCHY - Maroon Solid Classic Silk Tie",
      price: "1500.00",
      currency: "LE"
    },
    {
      name: "CHANEL Blue CC Pattern Silk Tie",
      tieImage: "/products/CHANEL/01-blue-cc-pattern-silk-tie/CHANEL%20Blue%20CC%20pattern%20silk%20tie.jpg",
      matchingLooks: [
        { label: "Chanel Look 1", image: "/matching/chanel-1.jpg" },
        { label: "Chanel Look 2", image: "/matching/chanel-2.jpg" },
        { label: "Chanel Look 3", image: "/matching/chanel-3.jpg" },
        { label: "Chanel Look 4", image: "/matching/chanel-4.jpg" }
      ],
      title: "CHANEL - CC Pattern Silk Tie (Blue)",
      price: "1400.00",
      currency: "LE"
    },
    {
      name: "Black Classic L.V Silk Tie",
      tieImage: "/products/LOUIS%20VUITTON/01-black-classic-lv-silk-tie/Black%20CLASSIC%20L.V%20SILK%20TIE.jpg",
      matchingLooks: [
        { label: "LV Look 1", image: "/matching/louis-vuitton-1.jpg" },
        { label: "LV Look 2", image: "/matching/louis-vuitton-2.jpg" },
        { label: "LV Look 3", image: "/matching/louis-vuitton-3.jpg" },
        { label: "LV Look 4", image: "/matching/louis-vuitton-4.jpg" }
      ],
      title: "LOUIS VUITTON - Classic LV Silk Tie (Black)",
      price: "1600.00",
      currency: "LE"
    },
    {
      name: "LOUIS VUITTON - Blue ECU Silk Tie",
      tieImage: "/products/LOUIS%20VUITTON/02-blue-ecu-silk-tie/LOUIS%20VUITTON%20-%20Blue%20ECU%20SILK%20TIE.jpg",
      matchingLooks: [
        { label: "LV Ecu Look 1", image: "/matching/louis-vuitton-ecu-1.jpg" },
        { label: "LV Ecu Look 2", image: "/matching/louis-vuitton-ecu-2.jpg" },
        { label: "LV Ecu Look 3", image: "/matching/louis-vuitton-ecu-3.jpg" },
        { label: "LV Ecu Look 4", image: "/matching/louis-vuitton-ecu-4.jpg" }
      ],
      title: "LOUIS VUITTON - Ecu Silk Tie (Blue)",
      price: "1400.00",
      currency: "LE"
    },
    {
      name: "HERMÈS - Hermes Paris Silk Tie (Navy)",
      tieImage: "/products/HERMES/02-navy-blue-hermes-paris-tie/Herm%C3%A8s%20Paris%20Navy%20Blue.jpg",
      matchingLooks: [
        { label: "Hermès Navy Look 1", image: "/matching/hermes-orange-1.jpg" },
        { label: "Hermès Navy Look 2", image: "/matching/hermes-orange-2.jpg" },
        { label: "Hermès Navy Look 3", image: "/matching/hermes-orange-3.jpg" },
        { label: "Hermès Navy Look 4", image: "/matching/hermes-orange-4.jpg" }
      ],
      title: "HERMÈS - Hermes Paris Silk Tie (Navy)",
      price: "1300.00",
      currency: "LE"
    },
    {
      name: "HERMES - Olive Petits Maillons Silk Tie",
      tieImage: "/products/HERMES/05-olive-petits-maillons-silk-tie/HERMES%20-%20Olive%20PETITS%20MAILLONS%20SILK%20TIE.jpg",
      matchingLooks: [
        { label: "Hermès Olive Look 1", image: "/matching/hermes-olive-1.jpg" },
        { label: "Hermès Olive Look 2", image: "/matching/hermes-olive-2.jpg" },
        { label: "Hermès Olive Look 3", image: "/matching/hermes-olive-3.jpg" },
        { label: "Hermès Olive Look 4", image: "/matching/hermes-olive-4.jpg" }
      ],
      title: "HERMÈS - Petits Maillons Silk Tie (Olive)",
      price: "1400.00",
      currency: "LE"
    },
    {
      name: "HERMES Tie SE",
      tieImage: "/products/HERMES/06-red-h-scintillant-silk-tie/Hermes%20-%20Red%20H%20scintillant%20silk%20tie.jpg",
      matchingLooks: [
        { label: "Hermès Red Look 1", image: "/matching/hermes-red-h-1.jpg" },
        { label: "Hermès Red Look 2", image: "/matching/hermes-red-h-2.jpg" },
        { label: "Hermès Red Look 3", image: "/matching/hermes-red-h-3.jpg" },
        { label: "Hermès Red Look 4", image: "/matching/hermes-red-h-4.jpg" }
      ],
      title: "HERMÈS - H Scintillant Silk Tie (Red)",
      price: "1600.00",
      currency: "LE"
    },
    {
      name: "Gucci - Purple Dark With GG Pattern Silk Tie",
      tieImage: "/products/GUCCI/10-purple-dark-gg-pattern-silk-tie/Gucci%20-%20Purple%20Dark%20With%20GG%20Pattern%20Silk%20Tie.jpg",
      matchingLooks: [
        { label: "Gucci Purple Look 1", image: "/matching/gucci-purple-1.jpg" },
        { label: "Gucci Purple Look 2", image: "/matching/gucci-purple-2.jpg" },
        { label: "Gucci Purple Look 3", image: "/matching/gucci-purple-3.jpg" },
        { label: "Gucci Purple Look 4", image: "/matching/gucci-purple-4.jpg" }
      ],
      title: "GUCCI - GG Pattern Silk Tie (Dark Purple)",
      price: "1200.00",
      currency: "LE"
    }
  ];

  const currentTie = matchingTies[selectedTieIndex];

  return (
    <section className="relative py-28 px-6 bg-[#070707] border-t border-b border-white/10 overflow-hidden text-center">
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#0a0a0a]/90 to-black/90 z-0" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <p className="text-xs uppercase tracking-[0.4em] text-[#C5A880] mb-3 font-medium">SIGNATURE PERSONAL STYLING</p>
        <h2
          className="text-4xl md:text-6xl text-white font-light tracking-[0.15em] mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          FIND YOUR PERFECT TIE
        </h2>
        <p className="text-white/60 text-xs md:text-sm tracking-wide max-w-xl mx-auto mb-12 leading-relaxed">
          Select a tie to discover its perfect matching suit combinations and styling harmony.
        </p>

        {/* Single "Choose a Tie" Button */}
        <div className="mb-16">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setModalOpen(true)}
            className="px-10 py-5 bg-[#C5A880] text-black font-semibold uppercase tracking-[0.25em] text-xs rounded-full shadow-2xl hover:bg-[#b3976f] transition-colors flex items-center justify-center mx-auto"
          >
            <span>Choose a Tie</span>
          </motion.button>
        </div>

        {/* Showcase: Matching Suit Photos (Left) + Selected Tie (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center max-w-6xl mx-auto text-left">
          {/* Left: Matching Suit Combination with Suit Color Buttons */}
          <div className="md:col-span-6 bg-[#111111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-8 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-medium">Matching Suit Combination</h4>
                <span className="text-[10px] text-white/55 tracking-widest uppercase">
                  {currentTie.matchingLooks[activeMatchingIndex].label}
                </span>
              </div>

              <div className="relative aspect-[3/4] overflow-hidden rounded-xl mb-6 bg-black/40 border border-white/10 shadow-lg">
                <img
                  key={currentTie.matchingLooks[activeMatchingIndex].image}
                  src={currentTie.matchingLooks[activeMatchingIndex].image}
                  alt={currentTie.matchingLooks[activeMatchingIndex].label}
                  loading="eager"
                  fetchPriority="high"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Suit Color / Look Buttons */}
              <div className="flex flex-wrap gap-2 mb-4">
                {currentTie.matchingLooks.map((look, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveMatchingIndex(idx)}
                    className={`px-3.5 py-2 rounded-lg text-xs tracking-wider uppercase transition-all ${
                      activeMatchingIndex === idx
                        ? 'bg-[#C5A880] text-black font-semibold shadow-lg'
                        : 'bg-white/5 text-white/70 border border-white/15 hover:bg-white/15 hover:text-white'
                    }`}
                  >
                    {look.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-between items-center text-white/60 text-xs tracking-wider">
              <span>Curated Styling Harmony</span>
              <span className="text-[#C5A880]">Maison Signature</span>
            </div>
          </div>

          {/* Right: Selected Tie Window */}
          <div className="md:col-span-6 bg-[#111111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-8 flex flex-col justify-between">
            <div>
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl mb-6 bg-black/40 border border-white/10 shadow-lg">
                <img
                  key={currentTie.tieImage}
                  src={currentTie.tieImage}
                  alt={currentTie.title}
                  loading="eager"
                  fetchPriority="high"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-[10px] text-[#C5A880] uppercase tracking-widest">
                  Selected Tie
                </div>
              </div>
              <h3 className="text-xl text-white font-light tracking-wide mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {currentTie.title}
              </h3>
            </div>
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/10">
              <span className="text-[#C5A880] font-light text-lg tracking-wider">{currentTie.currency} {currentTie.price}</span>
              <button
                onClick={() => addToCart({
                  id: 'MATCH-TIE-' + selectedTieIndex,
                  variantId: 'gid://shopify/ProductVariant/MATCH-TIE-' + selectedTieIndex,
                  title: currentTie.title,
                  brand: currentTie.title.split(' - ')[0],
                  price: currentTie.price,
                  currency: currentTie.currency,
                  image: currentTie.tieImage,
                  quantity: 1
                })}
                className="px-8 py-3.5 bg-[#C5A880] text-black font-semibold text-xs tracking-widest uppercase rounded-lg hover:bg-[#b3976f] transition shadow-lg"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Modal for Choosing a Tie */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 md:p-8"
          onClick={() => setModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0e0e0e] border border-[#C5A880]/30 rounded-3xl max-w-5xl w-full max-h-[85vh] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative overflow-hidden transform-gpu"
          >
            <div className="flex justify-between items-center px-6 py-5 border-b border-white/10 bg-[#121212] flex-shrink-0">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] mb-1 font-medium">CURATED SELECTION</p>
                <h3 className="text-xl md:text-2xl text-white tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  CHOOSE A TIE <span className="text-[#C5A880] text-sm">({matchingTies.length} Masterpieces)</span>
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-white/70 hover:text-white bg-white/5 hover:bg-white/15 p-2.5 rounded-full transition border border-white/10 flex-shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            <div
              className="p-6 md:p-8 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 scrollbar-thin scrollbar-thumb-[#C5A880]/40 scrollbar-track-transparent will-change-transform"
              style={{ WebkitOverflowScrolling: 'touch', transform: 'translate3d(0,0,0)' }}
            >
              {matchingTies.map((tie, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedTieIndex(idx);
                    setModalOpen(false);
                  }}
                  className={`group bg-[#161616] border rounded-2xl p-3.5 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-[#C5A880] hover:shadow-[0_10px_30px_rgba(197,168,128,0.15)] ${
                    selectedTieIndex === idx ? 'border-[#C5A880] bg-[#1a1a1a] ring-2 ring-[#C5A880]/50 shadow-lg' : 'border-white/10'
                  }`}
                >
                  <div className="aspect-[3/4] rounded-xl overflow-hidden mb-3 bg-black/50 border border-white/10">
                    <img src={tie.tieImage} alt={tie.name} loading="eager" fetchPriority="high" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h4 className="text-xs text-white font-light tracking-wide truncate group-hover:text-[#C5A880] transition-colors">{tie.name}</h4>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                    <span className="text-[10px] text-[#C5A880] tracking-wider uppercase font-medium">Select Tie</span>
                    <span className="text-[11px] text-white font-semibold">{tie.currency} {tie.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const CraftsmanshipBanner = () => {
  return (
    <section id="craftsmanship" className="bg-gradient-to-r from-[#0a0a0a] via-[#111111] to-[#0a0a0a] py-12 px-6 border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left items-center">
        <div className="flex items-center gap-4 justify-center md:justify-start">
          <div className="w-12 h-12 rounded-full bg-[#C5A880]/10 border border-[#C5A880]/30 flex items-center justify-center text-[#C5A880] text-xl font-serif">M</div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-medium mb-1">Como & Cairo Heritage</h4>
            <p className="text-xs text-white/60 tracking-wide">100% Jacquard Mulberry Silk with immaculate hand-finished drape.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 justify-center md:justify-start">
          <div className="w-12 h-12 rounded-full bg-[#C5A880]/10 border border-[#C5A880]/30 flex items-center justify-center text-[#C5A880] text-xl font-serif">✈</div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-medium mb-1">Worldwide VIP Shipping</h4>
            <p className="text-xs text-white/60 tracking-wide">Complimentary express delivery in signature luxury presentation boxes.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 justify-center md:justify-start">
          <div className="w-12 h-12 rounded-full bg-[#C5A880]/10 border border-[#C5A880]/30 flex items-center justify-center text-[#C5A880] text-xl font-serif">✦</div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-medium mb-1">Maison Guarantee</h4>
            <p className="text-xs text-white/60 tracking-wide">Uncompromising luxury quality backed by our lifetime authenticity seal.</p>
          </div>
        </div>
      </div>
    </section>
  );
};


const JournalModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#111111] border border-[#C5A880]/40 rounded-xl overflow-hidden max-w-2xl w-full p-8 shadow-2xl relative text-left max-h-[85vh] overflow-y-auto"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white bg-black/40 p-2 rounded-full transition"
          >
            <X size={20} />
          </button>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#C5A880] mb-2 font-medium">MAISON JOURNAL</p>
          <h2 className="text-3xl text-white font-light mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            The Art & Heritage of Jacquard Silk
          </h2>
          <div className="space-y-6 text-white/80 text-xs md:text-sm leading-relaxed font-light">
            <p>
              Every tie in the Maison Signature collection represents an uncompromising dialogue between classical European silk weaving traditions and modern Egyptian tailoring excellence.
            </p>
            <div className="border-l-2 border-[#C5A880] pl-4 my-4 italic text-white/90">
              "A gentleman's tie is not merely an accessory; it is the silent ambassador of his character, presence, and discernment."
            </div>
            <h4 className="text-white text-base font-medium tracking-wide">1. The Mastery of Weight & Drape</h4>
            <p>
              We exclusively utilize high-density jacquard mulberry silk with reinforced wool-blend interlining. This guarantees a permanent, flawless knot and a graceful, wrinkle-free drape that endures the longest boardrooms and galas.
            </p>
            <h4 className="text-base text-white font-medium tracking-wide">2. Curated Brand Harmony</h4>
            <p>
              From the iconic motifs of Gucci and Dior to the timeless elegance of Hermès and Burberry, our hand-selected curation ensures absolute sartorial harmony with your bespoke wardrobe.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ContactModal = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#111111] border border-[#C5A880]/40 rounded-xl overflow-hidden max-w-lg w-full p-8 shadow-2xl relative text-left"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white bg-black/40 p-2 rounded-full transition"
          >
            <X size={20} />
          </button>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#C5A880] mb-2 font-medium">VIP CONCIERGE & SUPPORT</p>
          <h2 className="text-3xl text-white font-light mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Contact The Maison
          </h2>

          {submitted ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full bg-[#C5A880]/20 border border-[#C5A880] text-[#C5A880] flex items-center justify-center text-2xl mx-auto mb-4">✓</div>
              <h3 className="text-white text-lg font-light mb-2">Inquiry Received</h3>
              <p className="text-white/60 text-xs">Our private client advisor will reach out to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/60 mb-1">Full Name</label>
                <input required type="text" placeholder="Lord / Mr. ..." className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880]" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/60 mb-1">Email Address</label>
                <input required type="email" placeholder="client@maison.com" className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880]" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/60 mb-1">Inquiry / Custom Styling Request</label>
                <textarea rows={3} placeholder="How may our concierge assist your wardrobe?" className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880]" />
              </div>
              <button type="submit" className="w-full py-3 bg-[#C5A880] text-black font-semibold text-xs tracking-widest uppercase rounded hover:bg-[#b3976f] transition">
                Submit Private Inquiry
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const SearchModal = ({ isOpen, onClose, addToCart, onQuickView }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const allProducts = [];
        for (const brand of BRANDS) {
          const res = await fetch(`/products/${brand.folder}/metadata.json`);
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              allProducts.push(...data.map(p => ({ ...p, brand: brand.name })));
            }
          }
        }
        const filtered = allProducts.filter(p =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
      } catch (e) {
        setResults([
          { id: 'S-1', title: 'Gucci Diamond Weave Silk Tie', brand: 'GUCCI', price: '949.00', currency: 'LE', image: '/products/GUCCI_!/DSC05686.jpg' },
          { id: 'S-2', title: 'Hermès Signature Printed Silk Tie', brand: 'HERMÈS', price: '999.00', currency: 'LE', image: '/products/HERMES_!/DSC06080.jpg' },
          { id: 'S-3', title: 'Dior Sapphire Jacquard Silk Tie', brand: 'DIOR', price: '949.00', currency: 'LE', image: '/products/DIOR_!/DSC05748.jpg' }
        ].filter(p => p.title.toLowerCase().includes(query.toLowerCase()) || p.brand.toLowerCase().includes(query.toLowerCase())));
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col pt-20 px-6"
        onClick={onClose}
      >
        <div className="max-w-3xl w-full mx-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-6">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#C5A880] font-medium">MAISON CATALOG SEARCH</p>
            <button onClick={onClose} className="text-white/60 hover:text-white p-2 rounded-full bg-white/5">
              <X size={20} />
            </button>
          </div>
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by brand, color, or silk weave..."
              className="w-full bg-white/5 border border-[#C5A880]/40 rounded-xl pl-12 pr-4 py-4 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#C5A880] shadow-2xl"
            />
          </div>

          <div className="max-h-[60vh] overflow-y-auto space-y-3">
            {results.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  onQuickView(product);
                  onClose();
                }}
                className="bg-[#111111] border border-white/10 hover:border-[#C5A880] rounded-xl p-4 flex items-center justify-between cursor-pointer transition group"
              >
                <div className="flex items-center gap-4">
                  <img src={product.image} alt={product.title} className="w-14 h-16 object-cover rounded" />
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#C5A880]">{product.brand}</span>
                    <h4 className="text-white text-sm font-light group-hover:text-[#C5A880] transition">{product.title}</h4>
                  </div>
                </div>
                <span className="text-[#C5A880] text-sm font-medium">{product.currency || 'LE'} {product.price}</span>
              </div>
            ))}
            {query && results.length === 0 && !loading && (
              <p className="text-center text-white/50 py-10 text-xs tracking-wider">No luxury ties found matching "{query}".</p>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const PressSection = () => {
  const publications = [
    { name: 'GQ MIDDLE EAST', quote: '“The definitive standard for gentleman luxury and immaculate silk drape.”' },
    { name: 'VOGUE MAN', quote: '“An extraordinary fusion of Italian jacquard weaving and Cairo craftsmanship.”' },
    { name: 'ROBB REPORT', quote: '“Maison Signature sets a towering benchmark for high-end designer neckwear.”' }
  ];

  return (
    <section className="py-24 px-6 bg-[#080808] border-t border-white/10 text-center">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs uppercase tracking-[0.4em] text-[#C5A880] mb-3 font-medium">CRITICAL ACCLAIM</p>
        <h2 className="text-3xl md:text-5xl text-white font-light tracking-wide mb-16" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          As Featured in Global Publications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {publications.map((pub, idx) => (
            <div key={idx} className="bg-white/[0.02] border border-white/10 p-8 rounded-xl backdrop-blur-md shadow-2xl flex flex-col justify-between">
              <p className="text-white/80 text-sm italic font-light leading-relaxed mb-6">"{pub.quote}"</p>
              <h4 className="text-xs uppercase tracking-[0.3em] text-[#C5A880] font-medium">{pub.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FloatingContactWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-14 right-0 sm:bottom-16 w-[260px] sm:w-72 bg-[#111111] border border-[#C5A880]/50 rounded-xl p-4 sm:p-5 shadow-2xl backdrop-blur-md mb-2 text-left"
          >
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/10">
              <h4 className="text-white text-xs uppercase tracking-[0.2em] font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Maison Support
              </h4>
              <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white p-1">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-2.5">
              <a
                href="https://wa.me/201130503073"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-2.5 sm:p-3 bg-white/5 hover:bg-white/10 rounded-lg transition text-white text-xs tracking-wider group"
              >
                <span className="text-[#C5A880] flex items-center justify-center p-1.5 bg-white/5 rounded-md shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </span>
                <div className="min-w-0">
                  <p className="text-[#C5A880] font-medium text-[10px] sm:text-[11px] uppercase truncate">WhatsApp</p>
                  <p className="text-white/80 text-[11px] sm:text-xs truncate">+20 11 30503073</p>
                </div>
              </a>
              <a
                href="https://www.instagram.com/signature__elite?rpxt=YWZvMWs0ZDdtaHgw"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-2.5 sm:p-3 bg-white/5 hover:bg-white/10 rounded-lg transition text-white text-xs tracking-wider group"
              >
                <span className="text-[#C5A880] flex items-center justify-center p-1.5 bg-white/5 rounded-md shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </span>
                <div className="min-w-0">
                  <p className="text-[#C5A880] font-medium text-[10px] sm:text-[11px] uppercase truncate">Instagram</p>
                  <p className="text-white/80 text-[11px] sm:text-xs truncate">@signature__elite</p>
                </div>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-[#C5A880] text-black px-4 sm:px-6 py-3 sm:py-3.5 rounded-full shadow-[0_0_30px_rgba(197,168,128,0.4)] flex items-center gap-2 font-semibold text-[11px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase backdrop-blur-md"
      >
        <span>📞 Contact Us</span>
      </motion.button>
    </div>
  );
};

const ToastNotification = ({ message }) => {
  if (!message) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className="fixed bottom-6 left-6 z-50 bg-[#111111] border border-[#C5A880] text-white px-5 py-4 rounded-xl shadow-[0_0_35px_rgba(197,168,128,0.3)] flex items-center gap-3 backdrop-blur-md"
    >
      <div className="w-8 h-8 rounded-full bg-[#C5A880]/20 flex items-center justify-center text-[#C5A880]">✦</div>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-[#C5A880] font-medium">Maison Bag Updated</p>
        <p className="text-xs text-white/90">{message}</p>
      </div>
    </motion.div>
  );
};


const FaqSection = () => {
  const [openIdx, setOpenIdx] = useState(null);
  const faqs = [
    { q: 'What material are the ties crafted from?', a: 'All Maison Signature ties are crafted from 100% high-density Jacquard Mulberry silk with reinforced wool-blend interlining for a flawless knot and drape.' },
    { q: 'Do you offer worldwide shipping?', a: 'Yes, we offer complimentary express international shipping in luxury presentation boxes for all orders.' },
    { q: 'How do I know which tie matches my suit?', a: 'Use our interactive "Find Your Perfect Tie" styling suite on the homepage to match your exact suit color with expert curated ties.' },
    { q: 'What is your response time promise for client inquiries?', a: 'Our VIP concierge team guarantees a response time of under 15 minutes around the clock, 365 days a year.' },
    { q: 'Can I return or exchange an item?', a: 'We offer uncompromised 30-day returns and exchanges on all unworn items in their original luxury packaging.' }
  ];

  return (
    <section className="py-24 px-6 bg-[#070707] border-t border-white/10">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-[#C5A880] mb-3 font-medium">FREQUENTLY ASKED QUESTIONS</p>
        <h2 className="text-3xl md:text-5xl text-white font-light tracking-wide mb-16" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Client Guidance & Inquiries
        </h2>
        <div className="space-y-4 text-left">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full px-6 py-4 flex justify-between items-center text-white font-light text-sm md:text-base hover:text-[#C5A880] transition"
              >
                <span>{faq.q}</span>
                <span className="text-[#C5A880]">{openIdx === idx ? '−' : '+'}</span>
              </button>
              {openIdx === idx && (
                <div className="px-6 pb-4 text-white/70 text-xs md:text-sm leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};



const CaseStudiesModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-6" onClick={onClose}>
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-[#111111] border border-[#C5A880]/40 rounded-xl max-w-3xl w-full p-8 shadow-2xl relative text-left max-h-[85vh] overflow-y-auto">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white p-2 bg-black/40 rounded-full"><X size={20} /></button>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#C5A880] mb-2 font-medium">MAISON CASE STUDIES</p>
          <h2 className="text-3xl text-white font-light mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Bespoke Wardrobe Engineering</h2>
          <div className="space-y-6 text-white/80 text-xs md:text-sm leading-relaxed font-light">
            <h4 className="text-white text-base font-medium">Case Study #01: The Groomsman Uniformity Project</h4>
            <p>For an exclusive wedding party of 12 groomsmen in Cairo, Maison Signature engineered bespoke coordinated silk ties matching deep charcoal suits with custom gold monogram embroidery.</p>
            <h4 className="text-white text-base font-medium">Case Study #02: Executive Boardroom Power Contrast</h4>
            <p>Partnering with regional C-suite executives to curate a 7-day rotational tie collection maximizing authority and visual contrast under boardroom lighting.</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ThankYouModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-[#111111] border border-[#C5A880] rounded-xl max-w-md w-full p-8 text-center shadow-2xl relative">
          <div className="w-16 h-16 rounded-full bg-[#C5A880]/20 border border-[#C5A880] text-[#C5A880] flex items-center justify-center text-2xl mx-auto mb-4">✓</div>
          <h2 className="text-2xl text-white font-light mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Thank You For Your Order</h2>
          <p className="text-white/70 text-xs leading-relaxed mb-6">Your luxury presentation box is being hand-packaged at our Cairo atelier. A tracking link has been sent to your email.</p>
          <button onClick={onClose} className="px-6 py-2.5 bg-[#C5A880] text-black font-semibold text-xs tracking-widest uppercase rounded hover:bg-[#b3976f] transition">Return to Maison</button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const PrivacyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-[#111111] border border-[#C5A880]/40 rounded-xl max-w-2xl w-full p-8 text-left max-h-[85vh] overflow-y-auto">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white p-2 bg-black/40 rounded-full"><X size={20} /></button>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#C5A880] mb-2 font-medium">LEGAL & PRIVACY</p>
          <h2 className="text-3xl text-white font-light mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Privacy Policy</h2>
          <p className="text-white/80 text-xs leading-relaxed font-light">Maison Signature protects your personal and financial data with uncompromising encryption. We never share your details with third parties.</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Breadcrumbs = ({ brandName }) => (
  <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-xs text-white/50 tracking-wider">
    <a href="#" className="hover:text-[#C5A880] transition">Home</a>
    <span>/</span>
    <a href="#brands" className="hover:text-[#C5A880] transition">Collections</a>
    <span>/</span>
    <span className="text-[#C5A880]">{brandName}</span>
  </div>
);

const TermsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-[#111111] border border-[#C5A880]/40 rounded-xl max-w-2xl w-full p-8 text-left max-h-[85vh] overflow-y-auto relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white p-2 bg-black/40 rounded-full"><X size={20} /></button>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#C5A880] mb-2 font-medium">LEGAL CONDITIONS</p>
          <h2 className="text-3xl text-white font-light mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Terms & Conditions</h2>
          <p className="text-white/80 text-xs leading-relaxed font-light">Welcome to Maison Signature. By accessing our platform and acquiring our luxury Mulberry silk neckwear, you agree to uphold our terms of authenticity, intellectual property rights, and secure international transaction guidelines.</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const CookieConsentBanner = ({ onAccept }) => {
  const [accepted, setAccepted] = useState(false);
  if (accepted) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0d0d0d] border-t border-[#C5A880]/30 p-4 md:px-8 flex flex-col items-center justify-center text-center gap-3 shadow-2xl">
      <p className="text-xs text-white/80 font-light max-w-2xl">
        We use cookies to ensure you get the finest luxury browsing experience and secure checkout encryption. <span className="text-[#C5A880]">Privacy Policy</span>
      </p>
      <div className="flex justify-center gap-3">
        <button onClick={() => setAccepted(true)} className="px-5 py-2 bg-white/10 text-white rounded text-xs tracking-widest uppercase hover:bg-white/20 transition">Manage</button>
        <button onClick={() => { setAccepted(true); onAccept && onAccept(); }} className="px-6 py-2 bg-[#C5A880] text-black font-semibold rounded text-xs tracking-widest uppercase hover:bg-[#b3976f] transition">Accept All</button>
      </div>
    </div>
  );
};

// Footer
const Footer = ({ onOpenPrivacy, onOpenTerms, onOpenCaseStudies }) => {
  return (
    <footer className="bg-[#030303] border-t border-white/10 py-16 px-6 text-white/75 pb-24 md:pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
          <div>
            <h3 className="text-white text-xs uppercase tracking-[0.25em] mb-6 font-medium">COLLECTIONS</h3>
            <ul className="space-y-3 text-xs tracking-wider">
              {BRANDS.map((brand) => (
                <li key={brand.name}>
                  <a href="#brands" className="hover:text-[#C5A880] transition">{brand.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white text-xs uppercase tracking-[0.25em] mb-6 font-medium">MAISON</h3>
            <ul className="space-y-3 text-xs tracking-wider">
              <li><button onClick={onOpenCaseStudies} className="hover:text-[#C5A880] transition text-left">Case Studies</button></li>
              <li><a href="#craftsmanship" className="hover:text-[#C5A880] transition">Egyptian Craftsmanship</a></li>
              <li><a href="#journal" className="hover:text-[#C5A880] transition">The Journal</a></li>
              <li><button onClick={onOpenPrivacy} className="hover:text-[#C5A880] transition text-left">Privacy Policy</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-xs uppercase tracking-[0.25em] mb-6 font-medium">SUPPORT</h3>
            <ul className="space-y-3 text-xs tracking-wider">
              <li><a href="#contact" className="hover:text-[#C5A880] transition">Contact Concierge</a></li>
              <li><a href="#shipping" className="hover:text-[#C5A880] transition">Shipping & Delivery</a></li>
              <li><a href="#returns" className="hover:text-[#C5A880] transition">Returns & Exchanges</a></li>
              <li><button onClick={onOpenTerms} className="hover:text-[#C5A880] transition text-left">Terms of Service</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-xs uppercase tracking-[0.25em] mb-6 font-medium">NEWSLETTER</h3>
            <p className="text-xs text-white/50 mb-4 leading-relaxed">
              Subscribe to receive private previews, tailored styling guides, and exclusive collection drops.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-white/5 border border-white/10 px-4 py-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#C5A880] flex-1"
              />
              <button className="bg-[#C5A880] text-black px-5 font-semibold text-xs tracking-widest uppercase hover:bg-[#b3976f] transition">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40 tracking-widest">
          <p>© 2026 MAISON SIGNATURE. ALL RIGHTS RESERVED. 100% MADE IN EGYPT & ITALY.</p>
          <div className="flex gap-6">
            <button onClick={onOpenPrivacy} className="hover:text-white transition">Privacy Policy</button>
            <button onClick={onOpenTerms} className="hover:text-white transition">Terms of Service</button>
            <button onClick={onOpenCaseStudies} className="hover:text-white transition">Case Studies</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main App Component
export default function SignatureLanding() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [journalOpen, setJournalOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [caseStudiesOpen, setCaseStudiesOpen] = useState(false);
  const [thankYouOpen, setThankYouOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedBrand, setSelectedBrand] = useState(BRANDS[0]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const handleNavigate = (item) => {
    if (item === 'Home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (item === 'Shop') {
      document.getElementById('brands')?.scrollIntoView({ behavior: 'smooth' });
    } else if (item === 'The Journal') {
      setJournalOpen(true);
    } else if (item === 'Contact') {
      setContactOpen(true);
    } else if (item === 'The Signature World') {
      document.getElementById('craftsmanship')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setToastMessage(`Added "${product.title}" to your collection.`);
    setTimeout(() => setToastMessage(''), 4000);
    setCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
    setTimeout(() => {
      document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white selection:bg-[#C5A880] selection:text-black font-sans">
      <AnnouncementBar />
      <Header cart={cart} setCartOpen={setCartOpen} searchOpen={searchOpen} setSearchOpen={setSearchOpen} onNavigate={handleNavigate} />
      <HeroSection onShopClick={() => document.getElementById('brands')?.scrollIntoView({ behavior: 'smooth' })} />
      <CraftsmanshipBanner />
      <BrandFilterSection selectedBrand={selectedBrand} onBrandSelect={handleBrandSelect} />
      <ShopByCollection selectedBrand={selectedBrand} addToCart={addToCart} onQuickView={setQuickViewProduct} />
      <FindYourPerfectTie addToCart={addToCart} onQuickView={setQuickViewProduct} />
      <PressSection />
      <FaqSection />
      <Footer onOpenPrivacy={() => setPrivacyOpen(true)} onOpenTerms={() => setTermsOpen(true)} onOpenCaseStudies={() => setCaseStudiesOpen(true)} />
      <CookieConsentBanner onAccept={() => {
        setToastMessage('Cookie preferences accepted.');
        setTimeout(() => setToastMessage(''), 5000);
      }} />
      <ToastNotification message={toastMessage} />
      <JournalModal isOpen={journalOpen} onClose={() => setJournalOpen(false)} />
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
      <TermsModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />
      <PrivacyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <CaseStudiesModal isOpen={caseStudiesOpen} onClose={() => setCaseStudiesOpen(false)} />
      <ThankYouModal isOpen={thankYouOpen} onClose={() => setThankYouOpen(false)} />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} addToCart={addToCart} onQuickView={setQuickViewProduct} />
      <CartDrawer
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        cart={cart}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
      />
      <ProductQuickView
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        addToCart={addToCart}
      />
      <FloatingContactWidget />
    </div>
  );
}
