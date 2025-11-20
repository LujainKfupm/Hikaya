//import all required dependencies
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getStories, deleteStoryById } from "../mocks/mockApi";
import { Star, Calendar, Baby } from "lucide-react";
import { useAuth } from "../context/AuthContext";
//temporary local array
const MOCK = [];



