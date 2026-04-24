"use client";

import { CheckCircle2, Loader2, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  type AdmissionTrackingPayload,
  trackAdmissionEvent,
} from "@/app/(landing)/premium/admission-tracking";

type Props = {
  handlePayment: () => void;
  isStartingPayment: boolean;
  onTrackEvent?: (payload: AdmissionTrackingPayload) => void;
  paymentComplete: boolean;
  paymentError: string;
  submitted: boolean;
  whatsappChannelUrl: string;
  whatsappMessage: string;
};

export function AdmissionCheckAfterPaymentCard({
  handlePayment,
  isStartingPayment,
  onTrackEvent = trackAdmissionEvent,
  paymentComplete,
  paymentError,
  submitted,
  whatsappChannelUrl,
  whatsappMessage,
}: Props) {
  return (
    <div className="mt-10 rounded-3xl bg-white p-4 text-[#002769] shadow-xl">
      <div className="flex items-start gap-3">
        <CheckCircle2
          className={cn(
            "mt-0.5 size-5 shrink-0",
            paymentComplete ? "text-[#027937]" : "text-green-600"
          )}
        />
        <div>
          <p className="font-black text-black">
            {paymentComplete ? "Payment received" : "After payment"}
          </p>
          <p className="mt-1 text-sm leading-6 text-neutral-500">
            {paymentComplete
              ? "Now send your details to an expert and join our WhatsApp channel for admission updates."
              : "Send your details to an expert and join our WhatsApp channel for admission updates."}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {submitted ? (
          <a
            href={whatsappMessage}
            onClick={() =>
              onTrackEvent({
                eventName: "send_details_whatsapp_clicked",
              })
            }
          >
            <Button className="h-11 w-full rounded-full bg-green-600 font-bold text-white hover:bg-green-700">
              Send details
              <MessageCircle className="size-4" />
            </Button>
          </a>
        ) : (
          <Button disabled className="h-11 w-full rounded-full bg-green-600 font-bold text-white">
            Send details
          </Button>
        )}

        {submitted ? (
          <a
            href={whatsappChannelUrl}
            onClick={() =>
              onTrackEvent({
                eventName: "join_admission_updates_clicked",
                metadata: {
                  source: "after_payment_card",
                },
              })
            }
          >
            <Button
              variant="outline"
              className="h-11 w-full rounded-full bg-white font-bold text-green-700 hover:bg-white"
            >
              Join channel
            </Button>
          </a>
        ) : (
          <Button
            disabled
            variant="outline"
            className="h-11 w-full rounded-full bg-white font-bold text-green-700"
          >
            Join channel
          </Button>
        )}

        {submitted ? (
          <Button
            type="button"
            variant="outline"
            disabled={isStartingPayment || paymentComplete}
            onClick={handlePayment}
            className="h-11 w-full rounded-full bg-white font-bold text-[#002769] hover:bg-white"
          >
            {isStartingPayment ? <Loader2 className="size-4 animate-spin" /> : null}
            {paymentComplete ? "Payment complete" : "Pay ₦1,000"}
          </Button>
        ) : (
          <Button
            disabled
            variant="outline"
            className="h-11 w-full rounded-full bg-white font-bold text-[#002769]"
          >
            Pay ₦1,000
          </Button>
        )}
      </div>

      {paymentError ? (
        <p className="mt-3 text-xs font-semibold leading-5 text-red-600">
          {paymentError}
        </p>
      ) : null}
    </div>
  );
}
