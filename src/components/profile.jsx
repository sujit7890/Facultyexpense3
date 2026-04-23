// src/components/Profile.jsx
import React, { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import collegeLogo from '../asset/MITADTU.png';
import './styles/Profile.css';


const DEFAULT_PROFILE = {
  name: '',
  email: '',
  department: '',
  phone: '',
  designation: '',
  office: '',
  bio: '',
  avatarDataUrl: '',
};

const DEPARTMENTS = [
  { value: '', label: 'Select department' },
  { value: 'CSE', label: 'Computer Science (CSE)' },
  { value: 'ECE', label: 'Electrical Engineering (ECE)' },
  { value: 'ME', label: 'Mechanical' },
  { value: 'BBA', label: 'BBA' },
  { value: 'MBA', label: 'MBA' },
  { value: 'Civil', label: 'Civil' },
  { value: 'Design', label: 'Design' },
];

const SAVED_KEY = 'userData';
const DRAFT_KEY = 'userProfileDraft';

export default function Profile() {
  const [user, setUser] = useState(null);
  // show read-only when saved profile exists, but we may open editor if a draft exists
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(DEFAULT_PROFILE);
  const [dirty, setDirty] = useState(false);

  const draftTimer = useRef(null);

  // load saved profile and draft (if any)
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(SAVED_KEY));
      const draft = JSON.parse(localStorage.getItem(DRAFT_KEY));

      if (stored && typeof stored === 'object' && stored.name) {
        setUser(stored);
        // if a draft exists and differs from saved profile, prefer draft and open editor
        if (draft && typeof draft === 'object' && draft.name && JSON.stringify(draft) !== JSON.stringify(stored)) {
          setForm({ ...DEFAULT_PROFILE, ...draft });
          setEditing(true); // resume editing from draft
        } else {
          // no conflicting draft -> show saved profile read-only
          setForm({
            name: stored.name || '',
            email: stored.email || '',
            department: stored.department || '',
            phone: stored.phone || '',
            designation: stored.designation || '',
            office: stored.office || '',
            bio: stored.bio || '',
            avatarDataUrl: stored.avatarDataUrl || '',
          });
          setEditing(false);
        }
      } else if (draft && typeof draft === 'object' && draft.name) {
        // no saved profile, but there is a draft -> continue editing
        setUser(null);
        setForm({ ...DEFAULT_PROFILE, ...draft });
        setEditing(true);
      } else {
        // nothing saved -> open editor for new profile
        setUser(null);
        setForm(DEFAULT_PROFILE);
        setEditing(true);
      }
    } catch (err) {
      console.error('Failed to load user data / draft', err);
      setUser(null);
      setForm(DEFAULT_PROFILE);
      setEditing(true);
    }

    return () => {
      if (draftTimer.current) {
        clearTimeout(draftTimer.current);
        draftTimer.current = null;
      }
    };
  }, []);

  // persist draft (debounced)
  const persistDraft = (nextForm) => {
    if (draftTimer.current) clearTimeout(draftTimer.current);
    draftTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(nextForm));
      } catch (e) {
        console.error('Failed to save draft', e);
      } finally {
        draftTimer.current = null;
      }
    }, 700);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => {
      const next = { ...p, [name]: value };
      setDirty(true);
      persistDraft(next);
      return next;
    });
  };

  const validate = () => {
    if (!form.name.trim()) {
      toast.error('Please enter your name');
      return false;
    }
    if (!form.email.trim()) {
      toast.error('Please enter your email');
      return false;
    }
    const rx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!rx.test(form.email.trim())) {
      toast.error('Please enter a valid email');
      return false;
    }
    if (!form.department) {
      toast.error('Please select your department');
      return false;
    }
    return true;
  };

  const handleSave = (e) => {
    e?.preventDefault();
    if (!validate()) return;

    const toStore = {
      name: form.name.trim(),
      email: form.email.trim(),
      department: form.department,
      phone: form.phone.trim(),
      designation: form.designation.trim(),
      office: form.office.trim(),
      bio: form.bio.trim(),
      avatarDataUrl: form.avatarDataUrl || '',
    };

    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(toStore));
      // remove draft after canonical save
      localStorage.removeItem(DRAFT_KEY);
      setUser(toStore);
      setEditing(false); // show read-only after save
      setDirty(false);
      toast.success('Profile saved');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save profile');
    }
  };

  const handleEdit = () => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        department: user.department || '',
        phone: user.phone || '',
        designation: user.designation || '',
        office: user.office || '',
        bio: user.bio || '',
        avatarDataUrl: user.avatarDataUrl || '',
      });
    }
    setEditing(true);
    setDirty(false);
  };

  const handleCancel = () => {
    if (user) {
      // discard draft and revert to saved profile
      localStorage.removeItem(DRAFT_KEY);
      setForm({
        name: user.name || '',
        email: user.email || '',
        department: user.department || '',
        phone: user.phone || '',
        designation: user.designation || '',
        office: user.office || '',
        bio: user.bio || '',
        avatarDataUrl: user.avatarDataUrl || '',
      });
      setEditing(false);
      setDirty(false);
    } else {
      // keep editing (no saved profile) — restore draft if present
      const draft = (() => {
        try {
          return JSON.parse(localStorage.getItem(DRAFT_KEY)) || null;
        } catch {
          return null;
        }
      })();
      if (draft) {
        setForm({ ...DEFAULT_PROFILE, ...draft });
        setEditing(true);
      } else {
        setForm(DEFAULT_PROFILE);
        setEditing(true);
      }
      setDirty(false);
    }
  };

  const handleDelete = () => {
    if (!window.confirm('Delete profile from this browser? This cannot be undone locally.')) return;
    try {
      localStorage.removeItem(SAVED_KEY);
      localStorage.removeItem(DRAFT_KEY);
    } catch (e) {
      console.error('Failed to remove localStorage keys', e);
    }
    setUser(null);
    setForm(DEFAULT_PROFILE);
    setEditing(true); // open editor for new profile
    setDirty(false);
    toast.info('Profile removed');
  };

  const handleAvatar = (file) => {
    if (!file) {
      setForm((p) => {
        const next = { ...p, avatarDataUrl: '' };
        setDirty(true);
        persistDraft(next);
        return next;
      });
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForm((p) => {
        const next = { ...p, avatarDataUrl: reader.result };
        setDirty(true);
        persistDraft(next);
        return next;
      });
    };
    reader.onerror = () => toast.error('Failed to read image');
    reader.readAsDataURL(file);
  };

  const initials = (nameStr) => {
    if (!nameStr) return 'NA';
    const parts = nameStr.trim().split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase() || '').join('');
  };

  const noChanges = !!user && (
    form.name === user?.name &&
    form.email === user?.email &&
    form.department === user?.department &&
    form.phone === user?.phone &&
    form.designation === user?.designation &&
    form.office === user?.office &&
    form.bio === user?.bio &&
    form.avatarDataUrl === user?.avatarDataUrl
  );

  // avatar: when editing show draft preview, otherwise show saved user image
  const avatarSrc = editing ? form.avatarDataUrl : (user?.avatarDataUrl || '');

  return (
    <>
     
      <div className="profile-root">
        <div className="profile-wrap" role="region" aria-label="User profile area">
          <div className="profile-card" aria-live="polite">
            <div className="profile-header">
              <img src={collegeLogo} alt="College logo" className="college-logo" />
              <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="title-area">
                  <h2 className="profile-title">{user ? user.name : 'Build your profile'}</h2>
                  <div className="profile-sub">{user ? (user.designation || user.department || 'Faculty') : 'Add details to personalize the app'}</div>
                </div>

                <div style={{ marginLeft: 12 }}>
                  <button className="btn btn-ghost" onClick={handleEdit} aria-label="Edit profile" title="Edit profile">
                    Edit profile
                  </button>
                </div>
              </div>
            </div>

            <div className="avatar-row">
              <div className="avatar" aria-hidden>
                {avatarSrc ? <img src={avatarSrc} alt="Profile" /> : initials(user?.name || form.name)}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  {!editing && user && (
                    <div style={{ flex: 1 }}>
                      <div className="detail-row">
                        <strong>Email</strong>
                        <span>{user.email}</span>
                      </div>
                      <div className="detail-row">
                        <strong>Department</strong>
                        <span>{user.department}</span>
                      </div>
                    </div>
                  )}
                  {editing && (
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <label htmlFor="avatarUpload" style={{ fontWeight: 700, color: '#0f172a' }}>Profile photo</label>
                        <input id="avatarUpload" type="file" accept="image/*" onChange={(e) => handleAvatar(e.target.files?.[0] || null)} style={{ marginLeft: 8 }} />
                      </div>
                      <div className="small-note">Recommended: square image, max 1MB.</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* read-only */}
            {!editing && user && (
              <>
                <div style={{ marginTop: 14 }}>
                  <div className="detail-row"><strong>Name</strong><span>{user.name}</span></div>
                  <div className="detail-row"><strong>Designation</strong><span>{user.designation || '—'}</span></div>
                  <div className="detail-row"><strong>Office / Room</strong><span>{user.office || '—'}</span></div>
                  <div className="detail-row"><strong>Phone</strong><span>{user.phone || '—'}</span></div>
                  <div style={{ paddingTop: 12 }}>
                    <strong style={{ display: 'block', marginBottom: 6 }}>Bio</strong>
                    <div style={{ color: '#475569' }}>{user.bio || '—'}</div>
                  </div>
                </div>

                <div className="form-actions" aria-hidden>
                  <button className="btn btn-danger" onClick={handleDelete}>Delete profile</button>
                </div>
              </>
            )}

            {/* edit/create form */}
            {(editing || !user) && (
              <form className="profile-form" onSubmit={handleSave} noValidate autoComplete="off">
                <div className="field">
                  <label htmlFor="name">Full name</label>
                  <input id="name" name="name" type="text" value={form.name} onChange={handleChange} placeholder="e.g., Prof. First Last" required autoComplete="off" spellCheck={false} inputMode="text" aria-label="Full name" />
                </div>

                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@mituniversity.edu.in" required autoComplete="off" spellCheck={false} aria-label="Email" />
                </div>

                <div className="field">
                  <label htmlFor="department">Department</label>
                  <select id="department" name="department" value={form.department} onChange={handleChange} required autoComplete="off" aria-label="Department">
                    {DEPARTMENTS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                </div>

                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 200px' }} className="field">
                    <label htmlFor="designation">Designation</label>
                    <input id="designation" name="designation" type="text" value={form.designation} onChange={handleChange} placeholder="Assistant Professor / Associate Professor" autoComplete="off" spellCheck={false} aria-label="Designation" />
                  </div>

                  <div style={{ flex: '1 1 140px' }} className="field">
                    <label htmlFor="office">Office / Room</label>
                    <input id="office" name="office" type="text" value={form.office} onChange={handleChange} placeholder="e.g., Room 214" autoComplete="off" spellCheck={false} aria-label="Office / Room" />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="phone">Phone (optional)</label>
                  <input id="phone" name="phone" type="text" value={form.phone} onChange={handleChange} placeholder="+91 9123456789" autoComplete="off" spellCheck={false} aria-label="Phone" />
                </div>

                <div className="field">
                  <label htmlFor="bio">Short bio (optional)</label>
                  <textarea id="bio" name="bio" value={form.bio} onChange={handleChange} placeholder="One-line bio or responsibilities" autoComplete="off" spellCheck={false} aria-label="Short bio" />
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-ghost" onClick={handleCancel}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={!dirty && noChanges}>Save profile</button>
                </div>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <aside className="profile-side">
            <div className="side-card" role="complementary" aria-label="Profile tips">
              <h4>Profile tips</h4>
              <p>Use a valid institute email so forms and notifications can be associated with your profile. Add a short bio so colleagues know your role.</p>
            </div>

            <div className="side-card">
              <h4>Privacy</h4>
              <p>Profile data (including photo) is saved locally in your browser (localStorage). Deleting the profile removes it from this browser only.</p>
            </div>

            <div className="side-card" style={{ textAlign: 'center', color: '#64748b', fontWeight: 700 }}>
              {user ? 'Profile is ready' : 'No profile yet — fill the form to get started'}
            </div>
          </aside>
        </div>

        <ToastContainer position="top-center" autoClose={1600} />
      </div>
    </>
  );
}
