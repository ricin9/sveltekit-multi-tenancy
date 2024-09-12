import { writable } from "svelte/store";
import type { Task } from "./(data)/schemas";

export const tasks = writable<Task[]>([]);
