# -*- coding: utf-8 -*-
from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

with open("requirements.txt", "r", encoding="utf-8") as fh:
    requirements = [line.strip() for line in fh if line.strip() and not line.startswith("#")]

setup(
    name="diamondcasa_jewellery",
    version="1.0.0",
    description="Custom Frappe app for Diamond Casa Jewellery ERP with DiamondCasa.com integration",
    long_description=long_description,
    long_description_content_type="text/markdown",
    author="Diamond Casa",
    author_email="dev@diamondcasa.in",
    packages=find_packages(),
    zip_safe=False,
    include_package_data=True,
    install_requires=requirements,
    python_requires=">=3.10",
)
