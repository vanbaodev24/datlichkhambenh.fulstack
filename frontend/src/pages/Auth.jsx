import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { login, register, clearError } from '../redux/slices/authSlice';
import './Auth.css';

export const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector(s => s.auth);

  useEffect(() => { if (user) navigate(user.role === 'admin' ? '/admin' : '/'); }, [user]);
  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(form));
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🏥 BookingCare</div>
        <h2>Đăng nhập</h2>
        <p className="auth-sub">Chào mừng trở lại! Vui lòng đăng nhập.</p>

        <div className="demo-accounts">
          <p>Tài khoản demo:</p>
          <button className="demo-btn" onClick={() => setForm({email:'admin@bookingcare.vn',password:'admin123'})}>
            👑 Admin
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-control" type="email" placeholder="email@example.com"
              value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} required />
          </div>
          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <input className="form-control" type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <p className="auth-footer">Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
      </div>
    </div>
  );
};

export const Register = () => {
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '', phone: '', gender: 'M' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(s => s.auth);

  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(register(form));
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    }
  };

  const set = (key) => (e) => setForm(f => ({...f, [key]: e.target.value}));

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🏥 BookingCare</div>
        <h2>Đăng ký tài khoản</h2>
        <p className="auth-sub">Tạo tài khoản để đặt lịch khám dễ dàng hơn</p>

        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Họ *</label>
              <input className="form-control" placeholder="Nguyễn" value={form.lastName} onChange={set('lastName')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Tên *</label>
              <input className="form-control" placeholder="Văn A" value={form.firstName} onChange={set('firstName')} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input className="form-control" type="email" placeholder="email@example.com" value={form.email} onChange={set('email')} required />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Số điện thoại</label>
              <input className="form-control" placeholder="0901234567" value={form.phone} onChange={set('phone')} />
            </div>
            <div className="form-group">
              <label className="form-label">Giới tính</label>
              <select className="form-control" value={form.gender} onChange={set('gender')}>
                <option value="M">Nam</option>
                <option value="F">Nữ</option>
                <option value="Other">Khác</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Mật khẩu *</label>
            <input className="form-control" type="password" placeholder="Ít nhất 6 ký tự" value={form.password} onChange={set('password')} required minLength={6} />
          </div>
          <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng ký'}
          </button>
        </form>
        <p className="auth-footer">Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
      </div>
    </div>
  );
};
