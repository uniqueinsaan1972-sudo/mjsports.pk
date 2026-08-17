export default function ProductSkeleton() {
  return (
    <div className="wrap" style={{ paddingTop: 40, paddingBottom: 70 }}>
      <div className="pd-layout">
        <div className="pd-gallery">
          <div className="skeleton skeleton-main-image" />
          <div className="pd-thumbs">
            <div className="skeleton skeleton-thumb" />
            <div className="skeleton skeleton-thumb" />
            <div className="skeleton skeleton-thumb" />
          </div>
        </div>
        <div className="pd-info">
          <div className="skeleton skeleton-line" style={{ width: "30%", height: 14 }} />
          <div className="skeleton skeleton-line" style={{ width: "70%", height: 34, marginTop: 14 }} />
          <div className="skeleton skeleton-line" style={{ width: "40%", height: 26, marginTop: 20 }} />
          <div className="skeleton skeleton-line" style={{ width: "100%", height: 14, marginTop: 24 }} />
          <div className="skeleton skeleton-line" style={{ width: "90%", height: 14, marginTop: 8 }} />
          <div className="skeleton skeleton-line" style={{ width: "60%", height: 14, marginTop: 8 }} />
          <div className="skeleton skeleton-line" style={{ width: "100%", height: 50, marginTop: 30, borderRadius: 10 }} />
        </div>
      </div>
    </div>
  );
}