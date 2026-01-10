import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectTrigger, SelectValue, SelectItem, SelectContent
} from "@/components/ui/select";
import Postcard from "@/components/SharedComponent/Postcard";

const Search = () => {
  const [articles, setArticles] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    searchTerm: searchParams.get("searchTerm") || "",
    sort: searchParams.get("sort") || "latest",
    category: searchParams.get("category") || "",
  });

  const fetchArticles = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/post/getposts?search=${filters.searchTerm}&sort=${filters.sort}&category=${filters.category}`
      );
      const data = await res.json();
      setArticles(data.posts || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [searchParams]);

  const applyFilters = () => {
    const params = {};
    if (filters.searchTerm) params.searchTerm = filters.searchTerm;
    if (filters.sort) params.sort = filters.sort;
    if (filters.category) params.category = filters.category;

    setSearchParams(params);
  };

  return (
    <div className="flex gap-5 p-5">
      {/* LEFT FILTER PANEL */}
      <div className="w-[250px] p-4 border rounded-lg shadow">
        <h2 className="font-semibold mb-3">Filters</h2>

        <label className="text-sm font-medium">Search Term:</label>
        <Input
          placeholder="Search..."
          value={filters.searchTerm}
          onChange={(e) =>
            setFilters({ ...filters, searchTerm: e.target.value })
          }
          className="mb-4"
        />

        <label className="text-sm font-medium">Sort By:</label>
        <Select
          value={filters.sort}
          onValueChange={(value) => setFilters({ ...filters, sort: value })}
        >
          <SelectTrigger className="mb-4">
            <SelectValue placeholder="Latest" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
          </SelectContent>
        </Select>

        <label className="text-sm font-medium">Category:</label>
        <Select
          value={filters.category}
          onValueChange={(value) => setFilters({ ...filters, category: value })}
        >
          <SelectTrigger className="mb-4">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="worldnews">World News</SelectItem>
            <SelectItem value="localnews">Local News</SelectItem>
            <SelectItem value="sports">Sports</SelectItem>
            <SelectItem value="business">Business</SelectItem>
          </SelectContent>
        </Select>

        <Button className="w-full mt-2 bg-red-600" onClick={applyFilters}>
          Apply Filters
        </Button>
      </div>

      {/* RIGHT RESULTS GRID */}
      <div className="flex-1">
  <h1 className="text-xl font-semibold mb-4">News Articles:</h1>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
    {articles.length > 0 ? (
      articles.map((post) => (
        <Postcard key={post._id} post={post} />
      ))
    ) : (
      <p className="text-gray-500">No articles found.</p>
    )}
  </div>
</div>
    </div>
  );
};

export default Search;