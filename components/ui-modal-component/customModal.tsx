"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import Home from "./DeBridgeWidget";

type CustomModalProps = {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  coin: string;
  action: string;
  dex: string;
};

const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  coin,
  action,
  dex,
}) => {
  const renderWidget = () => {
    console.log(dex);
    switch (dex) {
      case "debridge":
        return <Home />;
      case "uniswap":
        return (
          <iframe
            src={"https://app.uniswap.org/#/swap"}
            className="size-full border-none rounded-md"
            allowFullScreen
          />
        );
      case "raydium":
        return (
          <iframe
            src={"https://raydium.io/swap/"}
            className="size-full border-none rounded-md"
            allowFullScreen
          />
        );
      default:
        return (
          <iframe
            src={"https://pancakeswap.finance/swap"}
            className="size-full border-none rounded-md"
            allowFullScreen
          />
        );
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"/>
        <Dialog.Content className="fixed h-[90vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg shadow-lg max-w-[90%] z-50 min-w-md">
          <Dialog.Title className="text-lg font-bold mb-2 text-gray-800">
            {action}
          </Dialog.Title>
          <Dialog.Close asChild>
            <button className="absolute top-2 right-2 p-1 hover:text-red-500">
              <X size={24} />
            </button>
          </Dialog.Close>
          <div className="h-full ">{renderWidget()}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CustomModal;
