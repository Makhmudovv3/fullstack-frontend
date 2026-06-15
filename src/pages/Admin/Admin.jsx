import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, Users, ShoppingBag, Tag,
  Plus, Trash2, Edit, LogOut, ChevronRight, DollarSign,
  TrendingUp, Eye, Shield, ShieldOff, X, Check, Menu
} from 'lucide-react';
import { logout } from '../../redux/shopSlice';
import { toast } from 'react-toastify';
import './Admin.css';

const API = 'https://fullstack-backend-tplh.onrender.com/api/admin';

const Admin = () => {
  const user = useSelector(state => state.shop.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', description: '', price: '', image: '', categoryId: '' });
  const [categoryForm, setCategoryForm] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);

  const headers = { Authorization: `Bearer ${user?.token}`, 'Content-Type': 'application/json' };

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'dashboard') {
        const res = await fetch(`${API}/dashboard`, { headers });
        const data = await res.json();
        if (res.ok) setStats(data);
      } else if (activeTab === 'users') {
        const res = await fetch(`${API}/users`, { headers });
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } else if (activeTab === 'products') {
        const res = await fetch(`${API}/products`, { headers });
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
        const catRes = await fetch(`${API}/categories`, { headers });
        const catData = await catRes.json();
        setCategories(Array.isArray(catData) ? catData : []);
      } else if (activeTab === 'categories') {
        const res = await fetch(`${API}/categories`, { headers });
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } else if (activeTab === 'orders') {
        const res = await fetch(`${API}/orders`, { headers });
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      let imageUrl = productForm.image;

      // If user picked a file, upload it first
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await fetch(`${API}/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${user?.token}` }, // NO Content-Type for FormData
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.message || 'Rasm yuklanmadi');
        imageUrl = uploadData.url;
      }

      const url = editProduct ? `${API}/products/${editProduct.id}` : `${API}/products`;
      const method = editProduct ? 'PUT' : 'POST';
      
      const payload = { ...productForm, image: imageUrl };
      if (!payload.categoryId) payload.categoryId = null;
      if (!payload.image) payload.image = 'https://via.placeholder.com/300?text=No+Image';

      const res = await fetch(url, { method, headers, body: JSON.stringify(payload) });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || "Xatolik yuz berdi");

      toast.success(editProduct ? "Mahsulot yangilandi!" : "Mahsulot muvaffaqiyatli qo'shildi!");
      setShowModal(false);
      setEditProduct(null);
      setProductForm({ name: '', description: '', price: '', image: '', categoryId: '' });
      setImageFile(null);
      setImagePreview('');
      fetchData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleEditProduct = (p) => {
    setEditProduct(p);
    setProductForm({ name: p.name, description: p.description || '', price: p.price, image: p.image || '', categoryId: p.categoryId || '' });
    setImageFile(null);
    setImagePreview(p.image || '');
    setShowModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Rostdan o'chirmoqchimisiz?")) return;
    try {
      const res = await fetch(`${API}/products/${id}`, { method: 'DELETE', headers });
      if (!res.ok) throw new Error("O'chirishda xatolik");
      toast.success("Mahsulot o'chirildi!");
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.trim()) return;
    try {
      const res = await fetch(`${API}/categories`, { method: 'POST', headers, body: JSON.stringify({ name: categoryForm }) });
      if (!res.ok) throw new Error("Qo'shishda xato");
      toast.success("Kategoriya qo'shildi");
      setCategoryForm('');
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Rostdan o'chirmoqchimisiz?")) return;
    try {
      const res = await fetch(`${API}/categories/${id}`, { method: 'DELETE', headers });
      if (!res.ok) throw new Error("O'chirishda xatolik. Kategoriya band bo'lishi mumkin.");
      toast.success("Kategoriya o'chirildi!");
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Foydalanuvchini o'chirmoqchimisiz?")) return;
    try {
      const res = await fetch(`${API}/users/${id}`, { method: 'DELETE', headers });
      if (!res.ok) throw new Error("O'chirishda xatolik");
      toast.success("O'chirildi!");
      fetchData();
    } catch(err) { toast.error(err.message); }
  };

  const handleToggleAdmin = async (id) => {
    try {
      await fetch(`${API}/users/${id}/toggle-admin`, { method: 'PUT', headers });
      fetchData();
    } catch(err) { toast.error("Xatolik"); }
  };

  const handleOrderStatus = async (id, status) => {
    try {
      await fetch(`${API}/orders/${id}/status`, { method: 'PUT', headers, body: JSON.stringify({ status }) });
      toast.success("Holat o'zgardi");
      fetchData();
    } catch(err) { toast.error("Xatolik"); }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Buyurtmani o'chirmoqchimisiz?")) return;
    try {
      await fetch(`${API}/orders/${id}`, { method: 'DELETE', headers });
      fetchData();
    } catch(err) { toast.error("Xatolik"); }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { key: 'products', label: 'Mahsulotlar', icon: <Package size={20} /> },
    { key: 'categories', label: 'Kategoriyalar', icon: <Tag size={20} /> },
    { key: 'orders', label: 'Buyurtmalar', icon: <ShoppingBag size={20} /> },
    { key: 'users', label: 'Foydalanuvchilar', icon: <Users size={20} /> },
  ];

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}><X size={24} /></button>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <button
              key={item.key}
              className={`sidebar-item ${activeTab === item.key ? 'active' : ''}`}
              onClick={() => { setActiveTab(item.key); setSidebarOpen(false); }}
            >
              {item.icon}
              <span>{item.label}</span>
              <ChevronRight size={16} className="chevron" />
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'A'}</div>
            <div>
              <p className="admin-name">{user?.name || 'Admin'}</p>
              <p className="admin-role">Administrator</p>
            </div>
          </div>
          <button className="logout-btn" style={{ marginBottom: '10px', backgroundColor: '#f1f5f9', color: '#333' }} onClick={() => navigate('/')}>
            ⬅ Do'konga qaytish
          </button>
          <button className="logout-btn" onClick={handleLogout}><LogOut size={18} /> Chiqish</button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}><Menu size={24} /></button>
          <h1>{menuItems.find(m => m.key === activeTab)?.label}</h1>
        </header>

        <div className="admin-content">
          {activeTab === 'dashboard' && (
            <div className="dashboard-grid">
              <div className="stat-card stat-blue">
                <div className="stat-icon"><Users size={28} /></div>
                <div className="stat-info"><h3>{stats.totalUsers || 0}</h3><p>Foydalanuvchilar</p></div>
              </div>
              <div className="stat-card stat-green">
                <div className="stat-icon"><Package size={28} /></div>
                <div className="stat-info"><h3>{stats.totalProducts || 0}</h3><p>Mahsulotlar</p></div>
              </div>
              <div className="stat-card stat-orange">
                <div className="stat-icon"><ShoppingBag size={28} /></div>
                <div className="stat-info"><h3>{stats.totalOrders || 0}</h3><p>Buyurtmalar</p></div>
              </div>
              <div className="stat-card stat-purple">
                <div className="stat-icon"><DollarSign size={28} /></div>
                <div className="stat-info"><h3>${Number(stats.totalRevenue || 0).toLocaleString()}</h3><p>Umumiy daromad</p></div>
              </div>
              <div className="recent-orders-card">
                <h3><TrendingUp size={20} /> Oxirgi buyurtmalar</h3>
                {stats.recentOrders?.length > 0 ? (
                  <table className="admin-table">
                    <thead><tr><th>ID</th><th>Mijoz</th><th>Summa</th><th>Status</th><th>Sana</th></tr></thead>
                    <tbody>
                      {stats.recentOrders.map(o => (
                        <tr key={o.id}>
                          <td>#{o.id}</td>
                          <td>{o.User?.name || '-'}</td>
                          <td>${Number(o.totalAmount).toLocaleString()}</td>
                          <td><span className={`status-badge status-${o.status}`}>{o.status}</span></td>
                          <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <p className="empty-text">Hali buyurtmalar yo'q</p>}
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <div className="tab-actions">
                <button className="btn-primary" onClick={() => { setEditProduct(null); setProductForm({ name: '', description: '', price: '', image: '', categoryId: '' }); setShowModal(true); }}>
                  <Plus size={18} /> Yangi mahsulot
                </button>
              </div>
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead><tr><th>Rasm</th><th>Nomi</th><th>Narxi</th><th>Kategoriya</th><th>Amallar</th></tr></thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id}>
                        <td>{p.image ? <img src={p.image} alt="" className="product-thumb" onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/50?text=No+Image'; }} /> : <div className="no-img">📦</div>}</td>
                        <td>{p.name}</td>
                        <td>${Number(p.price).toLocaleString()}</td>
                        <td>{p.Category?.name || '-'}</td>
                        <td className="action-cell">
                          <button className="btn-icon btn-edit" onClick={() => handleEditProduct(p)}><Edit size={16} /></button>
                          <button className="btn-icon btn-delete" onClick={() => handleDeleteProduct(p.id)}><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {products.length === 0 && <p className="empty-text">Mahsulotlar yo'q</p>}
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div>
              <form className="inline-form" onSubmit={handleAddCategory}>
                <input type="text" placeholder="Yangi kategoriya nomi..." value={categoryForm} onChange={e => setCategoryForm(e.target.value)} required />
                <button type="submit" className="btn-primary"><Plus size={18} /> Qo'shish</button>
              </form>
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead><tr><th>ID</th><th>Nomi</th><th>Yaratilgan</th><th>Amal</th></tr></thead>
                  <tbody>
                    {categories.map(c => (
                      <tr key={c.id}>
                        <td>#{c.id}</td>
                        <td>{c.name}</td>
                        <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                        <td><button className="btn-icon btn-delete" onClick={() => handleDeleteCategory(c.id)}><Trash2 size={16} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {categories.length === 0 && <p className="empty-text">Kategoriyalar yo'q</p>}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="table-wrapper">
              <table className="admin-table">
                <thead><tr><th>ID</th><th>Mijoz</th><th>Email</th><th>Summa</th><th>Status</th><th>Sana</th><th>Amallar</th></tr></thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td>#{o.id}</td>
                      <td>{o.User?.name || '-'}</td>
                      <td>{o.User?.email || '-'}</td>
                      <td>${Number(o.totalAmount).toLocaleString()}</td>
                      <td>
                        <select className={`status-select status-${o.status}`} value={o.status} onChange={e => handleOrderStatus(o.id, e.target.value)}>
                          <option value="pending">Kutilmoqda</option>
                          <option value="processing">Tayyorlanmoqda</option>
                          <option value="shipped">Yo'lda</option>
                          <option value="delivered">Yetkazildi</option>
                          <option value="cancelled">Bekor qilindi</option>
                        </select>
                      </td>
                      <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td><button className="btn-icon btn-delete" onClick={() => handleDeleteOrder(o.id)}><Trash2 size={16} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && <p className="empty-text">Buyurtmalar yo'q</p>}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="table-wrapper">
              <table className="admin-table">
                <thead><tr><th>ID</th><th>Ism</th><th>Email</th><th>Admin</th><th>Sana</th><th>Amallar</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>#{u.id}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.isAdmin ? <span className="badge-admin">Admin</span> : <span className="badge-user">User</span>}</td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="action-cell">
                        <button className="btn-icon btn-edit" title={u.isAdmin ? "Adminlikni olish" : "Admin qilish"} onClick={() => handleToggleAdmin(u.id)}>
                          {u.isAdmin ? <ShieldOff size={16} /> : <Shield size={16} />}
                        </button>
                        {!u.isAdmin && <button className="btn-icon btn-delete" onClick={() => handleDeleteUser(u.id)}><Trash2 size={16} /></button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && <p className="empty-text">Foydalanuvchilar yo'q</p>}
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editProduct ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot'}</h3>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleProductSubmit} className="modal-form">
              <div className="form-group">
                <label>Nomi *</label>
                <input type="text" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Tavsif</label>
                <textarea value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} rows={3} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Narxi ($) *</label>
                  <input type="number" step="0.01" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Kategoriya</label>
                  <select value={productForm.categoryId} onChange={e => setProductForm({...productForm, categoryId: e.target.value})}>
                    <option value="">Tanlang...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Rasm yuklash</label>
                <div className="image-upload-area">
                  {(imagePreview || productForm.image) && (
                    <div className="image-preview">
                      <img
                        src={imagePreview || productForm.image}
                        alt="Preview"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  )}
                  <label className="file-upload-btn">
                    📁 Kompyuterdan rasm tanlash
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setImageFile(file);
                          setImagePreview(URL.createObjectURL(file));
                          setProductForm({ ...productForm, image: '' });
                        }
                      }}
                    />
                  </label>
                  <div className="url-divider">yoki URL kiriting</div>
                  <input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    value={imageFile ? '' : productForm.image}
                    disabled={!!imageFile}
                    onChange={(e) => {
                      setProductForm({ ...productForm, image: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                  />
                  {imageFile && (
                    <button type="button" className="clear-file-btn" onClick={() => { setImageFile(null); setImagePreview(editProduct?.image || ''); }}>
                      ✕ Faylni olib tashlash
                    </button>
                  )}
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Bekor qilish</button>
                <button type="submit" className="btn-primary" disabled={uploading}>
                  {uploading ? '⏳ Yuklanmoqda...' : <><Check size={18} /> {editProduct ? 'Saqlash' : 'Yaratish'}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
