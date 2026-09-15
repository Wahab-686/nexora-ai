function PageContainer({ title, description, children }) {
    return (
        <section className = "page-container">
            <div className = "page-header">
                <div>
                    <h1>{title}</h1>

                    {description && <p>{description}</p>}
                </div>
            </div>

            <div className = "page-content">
                { children }
            </div>
        </section>
    );
}

export default PageContainer;