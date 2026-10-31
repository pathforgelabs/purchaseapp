import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Checkout from './Checkout'
import {
  ArrowRight,
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  Truck,
  X,
} from 'lucide-react'

const products = [
  {
    id: 1,
    name: 'Aura Espresso Machine',
    category: 'Coffee & Drinks',
    price: 249,
    oldPrice: 299,
    rating: 4.8,
    reviews: 124,
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 2,
    name: 'Sage Stand Mixer',
    category: 'Kitchen',
    price: 379,
    rating: 4.9,
    reviews: 88,
    badge: 'New',
    image: 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bbcf?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 3,
    name: 'Quiet Air Purifier',
    category: 'Home Comfort',
    price: 189,
    oldPrice: 219,
    rating: 4.7,
    reviews: 231,
    badge: 'Save $30',
    image: 'https://images.unsplash.com/photo-1649323380033-d670d0c45c9f?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 4,
    name: 'Dawn Toaster',
    category: 'Kitchen',
    price: 89,
    rating: 4.6,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1576749905820-f9c3b34ebd65?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 5,
    name: 'Steam Iron Plus',
    category: 'Laundry',
    price: 129,
    rating: 4.8,
    reviews: 74,
    image: 'https://images.unsplash.com/photo-1526434426615-1abe81efcb0b?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 6,
    name: 'Compact Blender',
    category: 'Kitchen',
    price: 119,
    oldPrice: 149,
    rating: 4.7,
    reviews: 205,
    badge: '20% off',
    image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=900&q=85',
  },
]

const categories = [
  { name: 'Kitchen', count: 28, image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=700&q=85' },
  { name: 'Coffee & Drinks', count: 12, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=700&q=85' },
  { name: 'Home Comfort', count: 16, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=700&q=85' },
  { name: 'Laundry', count: 9, image: 'https://images.unsplash.com/photo-1626803775151-61d756612f97?auto=format&fit=crop&w=700&q=85' },
]

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('hearth-cart')) || []
    } catch {
      return []
    }
  })
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [cartOpen, setCartOpen] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('hearth-cart', JSON.stringify(cart))
  }, [cart])

  if (location.pathname === '/checkout') {
    return <Checkout cart={cart} setCart={setCart} />
  }

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase()
    return products.filter((product) => {
      const matchesCategory = category === 'All' || product.category === category
      const matchesSearch = !term || `${product.name} ${product.category}`.toLowerCase().includes(term)
      return matchesCategory && matchesSearch
    })
  }, [search, category])

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  const addToCart = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id)
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [...current, { ...product, quantity: 1 }]
    })
    setCartOpen(true)
  }

  const updateQuantity = (id, delta) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id) ? current.filter((favorite) => favorite !== id) : [...current, id],
    )
  }

  return (
    <div className="app">
      <header>
        <div className="announcement">Free delivery on orders over $150</div>
        <nav className="nav shell">
          <button className="menu-button" aria-label="Open menu" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <button className="brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="brand-mark">H</span>
            <span>Hearth <em>&</em> Home</span>
          </button>
          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <button onClick={() => { setCategory('All'); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }) }}>Shop</button>
            <button onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}>Categories</button>
            <button>New arrivals</button>
            <button>Our story</button>
          </div>
          <div className="nav-actions">
            <label className="search-box">
              <Search size={18} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search"
                aria-label="Search products"
              />
            </label>
            <button className="icon-button" aria-label="Favorites">
              <Heart size={21} />
              {favorites.length > 0 && <span className="favorite-dot" />}
            </button>
            <button className="icon-button cart-button" aria-label="Shopping bag" onClick={() => setCartOpen(true)}>
              <ShoppingBag size={21} />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </button>
          </div>
        </nav>
      </header>

      <main>
        <section className="hero shell">
          <div className="hero-copy">
            <p className="eyebrow">Made for everyday living</p>
            <h1>Thoughtful appliances for a <i>beautiful home.</i></h1>
            <p className="hero-text">Well-designed essentials that work beautifully, save energy, and fit seamlessly into your life.</p>
            <button className="primary-button" onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}>
              Shop appliances <ArrowRight size={17} />
            </button>
          </div>
          <div className="hero-image">
            <img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=90" alt="Bright modern kitchen with appliances" />
            <div className="hero-card">
              <span>Customer favorite</span>
              <strong>Elegant. Quiet. Efficient.</strong>
            </div>
          </div>
        </section>

        <section className="promise">
          <div className="shell promise-inner">
            <span><Truck size={20} /> Free delivery over $150</span>
            <span>30-day easy returns</span>
            <span>2-year warranty</span>
            <span>Expert support</span>
          </div>
        </section>

        <section className="categories-section shell" id="categories">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Find your everyday essential</p>
              <h2>Shop by category</h2>
            </div>
            <button className="text-button" onClick={() => setCategory('All')}>View all categories <ArrowRight size={16} /></button>
          </div>
          <div className="category-grid">
            {categories.map((item) => (
              <button
                key={item.name}
                className="category-card"
                onClick={() => {
                  setCategory(item.name)
                  document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                <img src={item.image} alt="" />
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.count} products</span>
                </div>
                <ArrowRight size={18} />
              </button>
            ))}
          </div>
        </section>

        <section className="products-section shell" id="shop">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Curated for quality</p>
              <h2>Popular right now</h2>
            </div>
            <button className="filter-button"><SlidersHorizontal size={16} /> Filter <ChevronDown size={15} /></button>
          </div>
          <div className="category-pills">
            {['All', 'Kitchen', 'Coffee & Drinks', 'Home Comfort', 'Laundry'].map((item) => (
              <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>
                {item}
              </button>
            ))}
          </div>
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image">
                  {product.badge && <span className="badge">{product.badge}</span>}
                  <button
                    className={`favorite-button ${favorites.includes(product.id) ? 'active' : ''}`}
                    aria-label="Add to favorites"
                    onClick={() => toggleFavorite(product.id)}
                  >
                    <Heart size={18} fill={favorites.includes(product.id) ? 'currentColor' : 'none'} />
                  </button>
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="product-info">
                  <p>{product.category}</p>
                  <h3>{product.name}</h3>
                  <div className="rating">
                    <Star size={14} fill="currentColor" />
                    <span>{product.rating}</span>
                    <small>({product.reviews})</small>
                  </div>
                  <div className="product-bottom">
                    <div className="price">
                      <strong>${product.price}</strong>
                      {product.oldPrice && <del>${product.oldPrice}</del>}
                    </div>
                    <button className="add-button" aria-label={`Add ${product.name} to cart`} onClick={() => addToCart(product)}>
                      <ShoppingBag size={17} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="newsletter">
          <div className="shell newsletter-inner">
            <div>
              <p className="eyebrow">A more considered home</p>
              <h2>Join our mailing list</h2>
            </div>
            <form onSubmit={(event) => event.preventDefault()}>
              <input type="email" placeholder="Your email address" aria-label="Email address" />
              <button aria-label="Subscribe"><ArrowRight size={20} /></button>
            </form>
          </div>
        </section>
      </main>

      {cartOpen && (
        <div className="cart-overlay" onMouseDown={() => setCartOpen(false)}>
          <aside className="cart-panel" onMouseDown={(event) => event.stopPropagation()}>
            <div className="cart-header">
              <div>
                <p className="eyebrow">Your selection</p>
                <h2>Shopping bag <span>({cartCount})</span></h2>
              </div>
              <button className="icon-button" aria-label="Close cart" onClick={() => setCartOpen(false)}><X size={22} /></button>
            </div>
            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <ShoppingBag size={38} strokeWidth={1.4} />
                  <h3>Your bag is empty</h3>
                  <p>Discover thoughtfully selected appliances for your home.</p>
                  <button className="primary-button" onClick={() => setCartOpen(false)}>Continue shopping</button>
                </div>
              ) : cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div>
                    <h3>{item.name}</h3>
                    <strong>${item.price}</strong>
                    <div className="quantity">
                      <button onClick={() => updateQuantity(item.id, -1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="subtotal"><span>Subtotal</span><strong>${subtotal}</strong></div>
                <p>Shipping and taxes calculated at checkout.</p>
                <button className="checkout-button" onClick={() => navigate('/checkout')}>Checkout <ArrowRight size={17} /></button>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  )
}

export default App
