"use client";

import { Crisp } from "crisp-sdk-web";
import { useEffect } from "react";

export const CrispChat = () => {
	useEffect(() => {
		Crisp.configure("49267a45-b0ee-445c-bfc8-7654c88ed9b3");
	}, []);

	return null;
};
