        document.addEventListener('DOMContentLoaded', function() {
            const switcherButtons = document.querySelectorAll('.switcher-btn');
            const sections = document.querySelectorAll('.section-content');
            
            switcherButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const targetSection = this.getAttribute('data-section');
                    
                    switcherButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    
                    sections.forEach(section => {
                        if (section.id === `${targetSection}-section`) {
                            document.querySelector('.section-content.active').classList.add('sliding-out');
                            
                            setTimeout(() => {
                                sections.forEach(s => {
                                    s.classList.remove('active', 'sliding-out');
                                    if (s.id === `${targetSection}-section`) {
                                        s.classList.add('active');
                                    }
                                });
                            }, 100);
                        }
                    });
                });
            });
        });