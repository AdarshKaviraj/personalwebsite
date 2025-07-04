// Blog Post Management System
class BlogManager {
    constructor() {
        this.posts = this.loadPosts();
    }

    loadPosts() {
        return JSON.parse(localStorage.getItem('blogPosts') || '[]');
    }

    savePosts(posts) {
        localStorage.setItem('blogPosts', JSON.stringify(posts));
        this.posts = posts;
    }

    addPost(post) {
        const posts = this.loadPosts();
        posts.unshift(post);
        this.savePosts(posts);
        this.updatePages();
    }

    updatePost(updatedPost) {
        const posts = this.loadPosts();
        const index = posts.findIndex(p => p.id === updatedPost.id);
        if (index !== -1) {
            posts[index] = updatedPost;
            this.savePosts(posts);
            this.updatePages();
        }
    }

    deletePost(postId) {
        const posts = this.loadPosts();
        const filteredPosts = posts.filter(p => p.id !== postId);
        this.savePosts(filteredPosts);
        this.updatePages();
    }

    updatePages() {
        this.updateIndexPage();
        this.updateBlogPage();
    }

    updateIndexPage() {
        const recentPosts = this.posts.slice(0, 2); // Show 2 most recent posts
        const postGrid = document.querySelector('.post-grid');
        
        if (postGrid && recentPosts.length > 0) {
            postGrid.innerHTML = recentPosts.map(post => this.createPostCard(post)).join('');
        }
    }

    updateBlogPage() {
        const dynamicPosts = document.querySelector('#dynamic-posts');
        
        if (dynamicPosts) {
            dynamicPosts.innerHTML = this.posts.map(post => this.createBlogListItem(post)).join('');
        }
    }

    createPostCard(post) {
        const date = new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
            <article class="post-card">
                <time class="post-date">${date}</time>
                <h3 class="post-title"><a href="/blog/${post.slug}.html">${post.title}</a></h3>
                <p class="post-excerpt">${post.excerpt}</p>
                <a href="/blog/${post.slug}.html" class="read-more">Read more →</a>
            </article>
        `;
    }

    createBlogListItem(post) {
        const date = new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
            <article class="blog-list-item">
                <time class="post-date">${date}</time>
                <h2 class="post-title"><a href="/blog/${post.slug}.html">${post.title}</a></h2>
                <p class="post-excerpt">${post.excerpt}</p>
                <a href="/blog/${post.slug}.html" class="read-more">Read more →</a>
            </article>
        `;
    }

    createBlogPostPage(post) {
        const date = new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.title} - Adarsh Kaviraj</title>
    <link rel="stylesheet" href="../styles/main.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Crimson+Text:ital@0;1&display=swap" rel="stylesheet">
</head>
<body>
    <header class="site-header">
        <nav class="nav-container">
            <a href="/" class="logo">Adarsh Kaviraj</a>
            <ul class="nav-links">
                <li><a href="/">Home</a></li>
                <li><a href="/blog.html">Blog</a></li>
                <li><a href="/about.html">About</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <header class="post-header">
            <h1>${post.title}</h1>
            <div class="post-meta">
                <time>${date}</time>
            </div>
        </header>

        <article class="post-content">
            ${this.markdownToHtml(post.content)}
        </article>
    </main>

    <footer class="site-footer">
        <div class="container">
            <p>&copy; 2025 Adarsh Kaviraj. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;
    }

    markdownToHtml(markdown) {
        let html = markdown;

        // Headers
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');

        // Bold and italic
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

        // Code
        html = html.replace(/`(.*?)`/g, '<code>$1</code>');

        // Links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

        // Blockquotes
        html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

        // Line breaks
        html = html.replace(/\n\n/g, '</p><p>');
        html = '<p>' + html + '</p>';

        // Clean up empty paragraphs
        html = html.replace(/<p><\/p>/g, '');
        html = html.replace(/<p><h([1-6])>/g, '<h$1>');
        html = html.replace(/<\/h([1-6])><\/p>/g, '</h$1>');
        html = html.replace(/<p><blockquote>/g, '<blockquote>');
        html = html.replace(/<\/blockquote><\/p>/g, '</blockquote>');

        return html;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    const blogManager = new BlogManager();
    
    // Update pages with stored posts
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        blogManager.updateIndexPage();
    } else if (window.location.pathname === '/blog.html') {
        blogManager.updateBlogPage();
    }
});

// Export for use in dashboard
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlogManager;
} else {
    window.BlogManager = BlogManager;
}