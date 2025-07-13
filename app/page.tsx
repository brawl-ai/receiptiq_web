import LaunchListWidget from './LaunchListWidget'

export default function Page() {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                minHeight: '100vh',
            }}
        >
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                <code>ReceiptIQ</code>
            </h1>
            <p style={{ marginBottom: '1rem', fontSize: '1rem' }}>
                AI-powered <code>receipt/invoice</code> data extraction
            </p>
            <LaunchListWidget />
        </div>
    )
}
