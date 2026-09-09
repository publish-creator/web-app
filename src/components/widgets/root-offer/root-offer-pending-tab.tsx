export const RootOfferPendingTab = ({ label, note }: { label: string; note: string }) => (
  <div className="border-border flex flex-col items-center gap-2 rounded-2xl border border-dashed py-16 text-center">
    <p className="text-sm font-medium">{label} ainda não está nesta tela.</p>
    <p className="text-muted max-w-96 text-sm">{note}</p>
  </div>
);
