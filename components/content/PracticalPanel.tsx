"use client";

import type { Locale, PracticalInformation } from "@/lib/types";
import { formatMoney, localize } from "@/lib/i18n";
import { t } from "@/lib/copy";
import { useCurrency } from "@/lib/currency-context";

export function PracticalPanel({ info, locale }: { info: PracticalInformation; locale: Locale }) {
  const { currency } = useCurrency();
  return (
    <aside className="border border-current p-4">
      <p className="caption mb-4">{t("practical", locale)}</p>
      {info.bestTimeToVisit ? (
        <Row label={t("bestTime", locale)} value={localize(info.bestTimeToVisit, locale)} />
      ) : null}
      {info.recommendedDuration ? <Row label={t("duration", locale)} value={info.recommendedDuration} /> : null}
      <Row label={t("currency", locale)} value={info.currencyAccepted.join(" · ")} />
      {info.estimatedCosts.accommodationMinUSD != null && info.estimatedCosts.accommodationMaxUSD != null ? (
        <Row
          label={t("stay", locale)}
          value={`${formatMoney(info.estimatedCosts.accommodationMinUSD, currency)} – ${formatMoney(info.estimatedCosts.accommodationMaxUSD, currency)}`}
        />
      ) : null}
      {info.estimatedCosts.foodAvgKES != null ? (
        <Row
          label={t("food", locale)}
          value={
            currency === "KES"
              ? formatMoney(info.estimatedCosts.foodAvgKES / 129, "KES")
              : formatMoney(info.estimatedCosts.foodAvgKES / 129, "USD")
          }
        />
      ) : null}
      {info.transportationNotes ? (
        <Row label={t("transport", locale)} value={localize(info.transportationNotes, locale)} />
      ) : null}
      {info.usefulTips ? (
        <div className="mt-4">
          <p className="caption">{t("tips", locale)}</p>
          <ul className="mt-2 flex flex-col gap-2 text-[12px] normal-case">
            {localize(info.usefulTips, locale).map((tip) => (
              <li key={tip}>— {tip}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </aside>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <p className="mb-3 text-[12px] normal-case">
      <span className="caption block">{label}</span>
      {value}
    </p>
  );
}
