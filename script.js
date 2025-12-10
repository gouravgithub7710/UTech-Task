    // SUPABASE CONFIGURATION--

    
        const SUPABASE_URL = 'https://zxdjkyoacyujmettabbf.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZGpreW9hY3l1am1ldHRhYmJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyNjkzODAsImV4cCI6MjA4MDg0NTM4MH0.2jqRrjzmH1SgUKpQR5QGn4UVV5Hn0UnfxvUENR5whsQ';

        const supabase = {
            from: (table) => ({
                select: async (columns = '*') => {
                    try {
                        const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${columns}`, {
                            headers: {
                                'apikey': SUPABASE_ANON_KEY,
                                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                            }
                        });
                        const data = await res.json();
                        return { data, error: !res.ok };
                    } catch (error) {
                        return { data: null, error: true };
                    }
                },
                insert: async (insertData) => {
                    try {
                        const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
                            method: 'POST',
                            headers: {
                                'apikey': SUPABASE_ANON_KEY,
                                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                                'Content-Type': 'application/json',
                                'Prefer': 'return=representation'
                            },
                            body: JSON.stringify(insertData)
                        });
                        const data = await res.json();
                        return { data, error: !res.ok };
                    } catch (error) {
                        return { data: null, error: true };
                    }
                }
            })
        };

        // ROTATING HERO BACKGROUNDS
        let currentBg = 0;
        const backgrounds = document.querySelectorAll('.hero-bg');
        
        setInterval(() => {
            backgrounds[currentBg].classList.remove('active');
            currentBg = (currentBg + 1) % backgrounds.length;
            backgrounds[currentBg].classList.add('active');
        }, 5000);

        // MOBILE MENU TOGGLE
        function toggleMenu() {
            document.getElementById('navLinks').classList.toggle('active');
        }

        // FAQ TOGGLE
        function toggleFaq(element) {
            element.classList.toggle('active');
        }

        // SHOW/HIDE FUNCTIONS
        function showAdmin() {
            document.getElementById('landingPage').style.display = 'none';
            document.getElementById('mainNavbar').style.display = 'none';
            document.getElementById('adminPanel').style.display = 'block';
            document.getElementById('adminNavbar').style.display = 'block';
            window.scrollTo(0, 0);
            loadContactsTable();
            loadSubscribersTable();
        }

        function showLanding() {
            document.getElementById('landingPage').style.display = 'block';
            document.getElementById('mainNavbar').style.display = 'block';
            document.getElementById('adminPanel').style.display = 'none';
            document.getElementById('adminNavbar').style.display = 'none';
            window.scrollTo(0, 0);
        }

        // TAB SWITCHING FROM NAVBAR
        function switchTabFromNav(event, tabName) {
            const tabs = document.querySelectorAll('.tab-content');
            const btns = document.querySelectorAll('.admin-nav-btn');
            
            tabs.forEach(tab => tab.classList.remove('active'));
            btns.forEach(btn => btn.classList.remove('active'));
            
            document.getElementById(tabName).classList.add('active');
            event.target.classList.add('active');
        }

        // TAB SWITCHING (Old function - kept for compatibility)
        function switchTab(event, tabName) {
            switchTabFromNav(event, tabName);
        }

        // TOAST NOTIFICATION
        function showToast(message, type = 'success') {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.className = `toast ${type} show`;
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

        // LOAD PROJECTS
        async function loadProjects() {
            const grid = document.getElementById('projectsGrid');
            grid.innerHTML = '<div class="empty-state"><p>Loading projects...</p></div>';
            
            const { data, error } = await supabase.from('projects').select();
            
            if (error || !data || data.length === 0) {
                grid.innerHTML = '<div class="empty-state"><p style="font-size: 1.2rem;">No projects yet. Add from admin panel!</p></div>';
                return;
            }
            
            grid.innerHTML = data.map(project => `
                <div class="project-card">
                    <img src="${project.image_url}" alt="${project.name}" class="project-image">
                    <div class="project-content">
                        <h3 class="project-title">${project.name}</h3>
                        <p class="project-description">${project.description}</p>
                        <button class="btn-read-more">Read More</button>
                    </div>
                </div>
            `).join('');
        }

        // LOAD CLIENTS
        async function loadClients() {
            const grid = document.getElementById('clientsGrid');
            grid.innerHTML = '<div class="empty-state"><p>Loading clients...</p></div>';
            
            const { data, error } = await supabase.from('clients').select();
            
            if (error || !data || data.length === 0) {
                grid.innerHTML = '<div class="empty-state"><p style="font-size: 1.2rem;">No clients yet. Add from admin panel!</p></div>';
                return;
            }
            
            grid.innerHTML = data.map(client => `
                <div class="client-card">
                    <img src="${client.image_url}" alt="${client.name}" class="client-image">
                    <p class="client-description">"${client.description}"</p>
                    <h4 class="client-name">${client.name}</h4>
                    <p class="client-designation">${client.designation}</p>
                </div>
            `).join('');
        }

        // LOAD CONTACTS TABLE
        async function loadContactsTable() {
            const container = document.getElementById('contactsTable');
            container.innerHTML = '<div class="empty-state"><p>Loading contacts...</p></div>';
            
            const { data, error } = await supabase.from('contacts').select();
            
            if (error || !data || data.length === 0) {
                container.innerHTML = '<div class="empty-state"><p>No contact forms submitted yet.</p></div>';
                return;
            }
            
            container.innerHTML = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>City</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(contact => `
                            <tr>
                                <td>${contact.full_name}</td>
                                <td>${contact.email}</td>
                                <td>${contact.mobile}</td>
                                <td>${contact.city}</td>
                                <td>${new Date(contact.created_at).toLocaleDateString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }

        // LOAD SUBSCRIBERS TABLE
        async function loadSubscribersTable() {
            const container = document.getElementById('subscribersTable');
            container.innerHTML = '<div class="empty-state"><p>Loading subscribers...</p></div>';
            
            const { data, error } = await supabase.from('subscribers').select();
            
            if (error || !data || data.length === 0) {
                container.innerHTML = '<div class="empty-state"><p>No subscribers yet.</p></div>';
                return;
            }
            
            container.innerHTML = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Subscribed On</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(sub => `
                            <tr>
                                <td>${sub.email}</td>
                                <td>${new Date(sub.created_at).toLocaleDateString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }

        // FORM SUBMISSIONS
        document.getElementById('contactForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = e.target.querySelector('.btn-submit');
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;
            
            const formData = new FormData(e.target);
            const data = {
                full_name: formData.get('full_name'),
                email: formData.get('email'),
                mobile: formData.get('mobile'),
                city: formData.get('city')
            };
            
            const { error } = await supabase.from('contacts').insert(data);
            
            if (!error) {
                showToast('Thank you! We will contact you soon.');
                e.target.reset();
            } else {
                showToast('Error submitting. Please try again.', 'error');
            }
            
            submitBtn.textContent = 'Submit';
            submitBtn.disabled = false;
        });

        document.getElementById('newsletterForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = e.target.querySelector('.btn-subscribe');
            submitBtn.textContent = 'Subscribing...';
            submitBtn.disabled = true;
            
            const formData = new FormData(e.target);
            const data = {
                email: formData.get('email')
            };
            
            const { error } = await supabase.from('subscribers').insert(data);
            
            if (!error) {
                showToast('Successfully subscribed!');
                e.target.reset();
            } else {
                showToast('Error subscribing. Email may already exist.', 'error');
            }
            
            submitBtn.textContent = 'Subscribe';
            submitBtn.disabled = false;
        });

        document.getElementById('projectForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = e.target.querySelector('.btn-submit');
            submitBtn.textContent = 'Adding...';
            submitBtn.disabled = true;
            
            const formData = new FormData(e.target);
            const data = {
                name: formData.get('name'),
                description: formData.get('description'),
                image_url: formData.get('image_url')
            };
            
            const { error } = await supabase.from('projects').insert(data);
            
            if (!error) {
                showToast('Project added successfully!');
                e.target.reset();
                await loadProjects();
            } else {
                showToast('Error adding project.', 'error');
            }
            
            submitBtn.textContent = 'Add Project';
            submitBtn.disabled = false;
        });

        document.getElementById('clientForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = e.target.querySelector('.btn-submit');
            submitBtn.textContent = 'Adding...';
            submitBtn.disabled = true;
            
            const formData = new FormData(e.target);
            const data = {
                name: formData.get('name'),
                designation: formData.get('designation'),
                description: formData.get('description'),
                image_url: formData.get('image_url')
            };
            
            const { error } = await supabase.from('clients').insert(data);
            
            if (!error) {
                showToast('Client added successfully!');
                e.target.reset();
                await loadClients();
            } else {
                showToast('Error adding client.', 'error');
            }
            
            submitBtn.textContent = 'Add Client';
            submitBtn.disabled = false;
        });

        // INITIAL LOAD
        loadProjects();
        loadClients();
    